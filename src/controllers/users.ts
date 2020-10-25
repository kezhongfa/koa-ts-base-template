/* eslint-disable no-magic-numbers */
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/users';
import config from '@/config';

const { secret } = config;
class UsersCtrl {
  async find(ctx: any) {
    ctx.body = await User.find();
  }

  async findById(ctx: any) {
    // findById 方法实现查找
    const user = await User.findById(ctx.params.id);
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
    const repeatedUser = await User.findOne({ name });
    // 409 表示冲突
    if (repeatedUser) {
      ctx['throw'](409, '用户名已被占用');
    }
    const user = await new User(ctx.request.body).save();
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
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx['throw'](404, '用户不存在');
    }
    ctx.body = user;
  }

  async delete(ctx: any) {
    // findByIdAndRemove 方法实现删除
    const user = await User.findByIdAndRemove(ctx.params.id);
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
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx['throw'](401, '用户名或密码不正确');
    }
    const { _id, name } = user as any;
    // expiresIn: '1d' 过期时间1天
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
    ctx.body = { token };
  }
}

export default new UsersCtrl();
