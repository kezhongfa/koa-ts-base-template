/* eslint-disable require-atomic-updates */
/* eslint-disable no-magic-numbers */
import { Context } from 'koa';
import TopicModel from '../models/topics';

class TopicCtrl {
  async find(ctx: Context) {
    const { pagesize = 10 } = ctx.query;
    const page = Math.max(Number(ctx.query.page), 1) - 1;
    const pageSize = Math.max(Number(pagesize), 1);
    ctx.body = await TopicModel.find({ name: new RegExp(ctx.query.q) })
      .limit(pageSize)
      .skip(page * pageSize);
  }

  async findById(ctx: Context) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((f: any) => f)
      .map((f: string) => ` +${f}`)
      .join('');
    // eslint-disable-next-line no-console
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
    // findByIdAndUpdate 返回的topic 是更新前的
    const topic = await TopicModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = topic;
  }
}

export default new TopicCtrl();
