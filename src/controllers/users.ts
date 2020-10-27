/* eslint-disable require-atomic-updates */
/* eslint-disable no-magic-numbers */
import jsonwebtoken from 'jsonwebtoken';
import UserModel from '../models/users';
import config from '@/config/jwt';

const { secret, options } = config;
const { expiresIn } = options;
class UsersCtrl {
  async find(ctx: any) {
    ctx.body = await UserModel.find();
  }

  async findById(ctx: any) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((f: any) => f)
      .map((f: string) => ` +${f}`)
      .join('');
    // eslint-disable-next-line no-console
    console.log('selectFields: ', selectFields);
    // findById 方法实现查找
    const user = await UserModel.findById(ctx.params.id).select(selectFields);
    if (!user) {
      ctx['throw'](404, '用户不存在');
    }
    ctx.body = user;
  }

  async create(ctx: any) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    });
    const { name } = ctx.request.body;
    const repeatedUser = await UserModel.findOne({ name });
    // 409 表示冲突
    if (repeatedUser) {
      ctx['throw'](409, '用户名已被占用');
    }
    // const user = await new User(ctx.request.body).save();
    const user = await UserModel.create(ctx.request.body);
    ctx.body = user;
  }

  async checkOwner(ctx: any, next: any) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx['throw'](403, '没有权限');
    }
    await next();
  }

  async update(ctx: any) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false },
    });
    const user = await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx['throw'](404, '用户不存在');
    }
    ctx.body = user;
  }

  async delete(ctx: any) {
    // findByIdAndRemove 方法实现删除
    const user = await UserModel.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx['throw'](404, '用户不存在');
    }
    ctx.status = 204;
  }

  async login(ctx: any) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    });
    const user = await UserModel.findOne(ctx.request.body);
    if (!user) {
      ctx['throw'](401, '用户名或密码不正确');
    }
    const { _id, name } = user as any;
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn });
    ctx.body = { token };
  }

  // 获取关注列表
  async listFollowing(ctx: any) {
    const user = (await UserModel.findById(ctx.params.id)
      .select('+following')
      .populate('following')) as any;
    if (!user) {
      ctx['throw'](404, 'user not exsits');
    }
    // eslint-disable-next-line require-atomic-updates
    ctx.body = user!.following;
  }

  // 关注某人
  async follow(ctx: any) {
    // 关注某人一定会有登录态，从state中获取自己用户id,并查询自己关注列表
    const me = (await UserModel.findById(ctx.state.user._id).select('+following')) as any;
    // 判断关注列表中是否已经存在
    if (me && !me.following.map((id: string) => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }

  // 粉丝列表
  async listFollowers(ctx: any) {
    const users = await UserModel.find({ following: ctx.params.id });
    ctx.body = users;
  }

  // 取消关注
  async unfollow(ctx: any) {
    // 关注某人一定会有登录态，从state中获取自己用户id,并查询自己关注列表
    const me = (await UserModel.findById(ctx.state.user._id).select('+following')) as any;
    const index = me.following.map((id: string) => id.toString()).indexOf(ctx.params.id);
    // 判断关注列表中是否已经存在
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
}

export default new UsersCtrl();
