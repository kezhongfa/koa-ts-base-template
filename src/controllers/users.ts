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
    // findById 方法实现查找
    const user = await UserModel.findById(ctx.params.id);
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
}

export default new UsersCtrl();
