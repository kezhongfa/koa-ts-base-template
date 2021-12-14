/* eslint-disable no-console */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-magic-numbers */
import { Context, Next } from 'koa';
import TopicModel from '@/model/topic';
import UserModel from '@/model/user';
import QuestionModel from '@/model/question';

class TopicCtrl {
  async checkTopicExists(ctx: Context, next: Next) {
    const topic = await TopicModel.findById(ctx.params.id);
    if (!topic) {
      ctx['throw'](404, 'topic not exsits');
    }
    await next();
  }

  async find(ctx: Context) {
    const { pagesize = 10 } = ctx.query;
    const page = Math.max(Number(ctx.query.page), 1) - 1;
    const pageSize = Math.max(Number(pagesize), 1);
    ctx.body = await TopicModel.find({ name: new RegExp(ctx.query.q as string, 'i') })
      .limit(pageSize)
      .skip(page * pageSize);
  }

  async findById(ctx: Context) {
    const { fields = '' } = ctx.query;
    const selectFields = (fields as string)
      .split(';')
      .filter((f: any) => f)
      .map((f: string) => ` +${f}`)
      .join('');
    console.log('selectFields: ', selectFields);
    const topic = await TopicModel.findById(ctx.params.id).select(selectFields);
    ctx.body = topic;
  }

  async create(ctx: Context) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    });
    const topic = await new TopicModel(ctx.request.body).save();
    ctx.body = topic;
  }

  async update(ctx: Context) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    });
    const topic = await TopicModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true,
    });
    ctx.body = topic;
  }

  async listTopicFollowers(ctx: Context) {
    const users = await UserModel.find({ followingTopics: ctx.params.id });
    ctx.body = users;
  }

  async listQuestions(ctx: Context) {
    const questions = await QuestionModel.find({ topics: ctx.params.id });
    ctx.body = questions;
  }
}

export default new TopicCtrl();
