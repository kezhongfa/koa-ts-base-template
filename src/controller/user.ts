/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-magic-numbers */
import jsonwebtoken from 'jsonwebtoken';
import { Context, Next } from 'koa';
import UserModel from '@/model/user';
import QuestionModel from '@/model/question';
import AnswerModel from '@/model/answer';
import config from '@/config/jwt';
import { IUserDocument } from '@/model/user/type';
import { encode } from '@/util/crypto';

const { secret, options } = config;
const { expiresIn } = options;
class UsersCtrl {
  // 授权，查看是不是自己
  async checkOwner(ctx: Context, next: Next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx['throw'](403, '没有权限');
    }
    await next();
  }

  // 判断用户是否存在
  async checkUserExist(ctx: Context, next: Next) {
    const user = await UserModel.findById(ctx.params.id);
    if (!user) {
      ctx['throw'](404, '用户不存在');
    } else {
      await next();
    }
  }

  async find(ctx: Context) {
    const { pagesize = 10, page = 1 } = ctx.query;
    const _page = Math.max(Number(page), 1) - 1;
    const _pageSize = Math.max(Number(pagesize), 1);

    const data = await UserModel.find({ name: new RegExp(ctx.query.q, 'i') })
      .limit(_pageSize)
      .skip(_page * _pageSize);
    ctx.body = {
      success: true,
      data,
    };
  }

  async findById(ctx: Context) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((f: any) => f)
      .map((f: string) => ` ${f}`)
      .join('');
    const populateStr = fields
      .split(';')
      .filter((f: any) => f)
      .map((f: string) => {
        if (f === 'employments') {
          return 'employments.company employments.job';
        }
        if (f === 'educations') {
          return 'educations.school educations.major';
        }
        return f;
      })
      .join(' ');

    console.log('selectFields:', fields, selectFields, populateStr);
    const data = await UserModel.findById(ctx.params.id).select(selectFields).populate(populateStr);

    if (!data) {
      ctx['throw'](404, '用户不存在');
    }
    ctx.body = {
      success: true,
      data,
    };
  }

  async create(ctx: Context) {
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
    // const user = await new UserModel(ctx.request.body).save();
    const data = await UserModel.create(ctx.request.body);
    ctx.body = {
      success: true,
      data,
    };
  }

  async update(ctx: Context) {
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

    const data = await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    if (!data) {
      ctx['throw'](404, '用户不存在');
    }
    ctx.body = {
      success: true,
      data,
    };
  }

  async delete(ctx: Context) {
    // findByIdAndRemove 方法实现删除
    const user = await UserModel.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx['throw'](404, '用户不存在');
    }
    ctx.status = 204;
  }

  async login(ctx: Context) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    });
    const { name, password } = ctx.request.body;
    const user = (await UserModel.findOne({ name }).select('+password')) as IUserDocument;
    if (!user) {
      ctx['throw'](401, '账号不存在');
    }

    if (user.password !== encode(password)) {
      ctx['throw'](500, '密码不正确');
    }
    const { _id } = user;
    const token = jsonwebtoken.sign({ _id, name: user.name }, secret, { expiresIn });
    ctx.body = {
      success: true,
      data: token,
    };
  }

  // 获取关注列表
  async listFollowing(ctx: Context) {
    const data = await UserModel.findById(ctx.params.id).select('following').populate('following');
    if (!data) {
      ctx['throw'](404, 'user not exsits');
    }

    ctx.body = {
      success: true,
      data: data!.following,
    };
  }

  // 关注某人
  async follow(ctx: Context) {
    // 关注某人一定会有登录态，从state中获取自己用户id,并查询自己关注列表
    const me = await UserModel.findById(ctx.state.user._id).select('+following');
    // 判断关注列表中是否已经存在
    if (!me?.following.map((id) => id.toString()).includes(ctx.params.id)) {
      me?.following.push(ctx.params.id);
      me?.save();
    }
    ctx.status = 204;
  }

  // 粉丝列表
  async listFollowers(ctx: Context) {
    // 语法灵活,虽然following是数组,但是可以直接传id,属于包含关系查询
    const data = await UserModel.find({ following: ctx.params.id });
    console.log('data1:', data);

    ctx.body = {
      success: true,
      data,
    };
  }

  // 取消关注
  async unfollow(ctx: Context) {
    // 关注某人一定会有登录态，从state中获取自己用户id,并查询自己关注列表
    const me = await UserModel.findById(ctx.state.user._id).select('+following');
    const index = me?.following.map((id) => id.toString()).indexOf(ctx.params.id);
    // 判断关注列表中是否已经存在
    if (index && index > -1) {
      me?.following.splice(index, 1);
      me?.save();
    }
    ctx.status = 204;
  }

  async listFollowingTopics(ctx: Context) {
    const data = (await UserModel.findById(ctx.params.id)
      .select('+followingTopics')
      .populate('followingTopics')) as IUserDocument;
    if (!data) {
      ctx['throw'](404, 'user not exsits');
    }
    ctx.body = {
      success: true,
      data: data.followingTopics,
    };
  }

  async followTopic(ctx: Context) {
    const me = (await UserModel.findById(ctx.state.user._id).select(
      '+followingTopics'
    )) as IUserDocument;
    if (!me.followingTopics.map((id) => id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }

  async unfollowTopic(ctx: Context) {
    const me = (await UserModel.findById(ctx.state.user._id).select(
      '+followingTopics'
    )) as IUserDocument;
    const index = me.followingTopics.map((id) => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.followingTopics.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }

  async listQuestions(ctx: Context) {
    const questions = await QuestionModel.find({ questioner: ctx.params.id });
    ctx.body = questions;
  }

  async listLikingAnswers(ctx: Context) {
    const user = (await UserModel.findById(ctx.params.id)
      .select('+likingAnswers')
      .populate('likingAnswers')) as IUserDocument;
    if (!user) {
      ctx['throw'](404, 'user not exsits');
    }
    ctx.body = user.likingAnswers;
  }

  async likeAnswer(ctx: Context, next: Next) {
    const me = (await UserModel.findById(ctx.state.user._id).select(
      '+likingAnswers'
    )) as IUserDocument;
    if (!me.likingAnswers.map((id) => id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id);
      me.save();
      await AnswerModel.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 } }, { new: true });
    }
    ctx.status = 204;
    await next();
  }

  async unlikeAnswer(ctx: Context) {
    const me = (await UserModel.findById(ctx.state.user._id).select(
      '+likingAnswers'
    )) as IUserDocument;
    const index = me.likingAnswers.map((id) => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.likingAnswers.splice(index, 1);
      me.save();
      await AnswerModel.findByIdAndUpdate(
        ctx.params.id,
        { $inc: { voteCount: -1 } },
        { new: true }
      );
    }
    ctx.status = 204;
  }

  async listDislikingAnswers(ctx: Context) {
    const user = (await UserModel.findById(ctx.params.id)
      .select('+dislikingAnswers')
      .populate('dislikingAnswers')) as IUserDocument;
    if (!user) {
      ctx['throw'](404, 'user not exsits');
    }
    ctx.body = user.dislikingAnswers;
  }

  async dislikeAnswer(ctx: Context, next: Next) {
    const me = (await UserModel.findById(ctx.state.user._id).select(
      '+dislikingAnswers'
    )) as IUserDocument;
    if (!me.dislikingAnswers.map((id) => id.toString()).includes(ctx.params.id)) {
      me.dislikingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }

  async unDislikeAnswer(ctx: Context) {
    const me = (await UserModel.findById(ctx.state.user._id).select(
      '+dislikingAnswers'
    )) as IUserDocument;
    const index = me.dislikingAnswers.map((id) => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.dislikingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }

  async listCollectingAnswers(ctx: Context) {
    const user = (await UserModel.findById(ctx.params.id)
      .select('+collectingAnswers')
      .populate('collectingAnswers')) as IUserDocument;
    if (!user) {
      ctx['throw'](404, 'user not exsits');
    }
    ctx.body = user.collectingAnswers;
  }

  async collectAnswer(ctx: Context, next: Next) {
    const me = (await UserModel.findById(ctx.state.user._id).select(
      '+collectingAnswers'
    )) as IUserDocument;
    if (!me.collectingAnswers.map((id) => id.toString()).includes(ctx.params.id)) {
      me.collectingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }

  async unCollectAnswer(ctx: Context) {
    const me = (await UserModel.findById(ctx.state.user._id).select(
      '+collectingAnswers'
    )) as IUserDocument;
    const index = me.collectingAnswers.map((id) => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.collectingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
}

export default new UsersCtrl();
