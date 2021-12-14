/* eslint-disable no-magic-numbers */
/* eslint-disable require-atomic-updates */
import { Context, Next } from 'koa';
import QuestionModel from '@/model/question';

class QuestionCtrl {
  async find(ctx: Context) {
    const { pagesize = 10 } = ctx.query;
    const page = Math.max(Number(ctx.query.page), 1) - 1;
    const pageSize = Math.max(Number(pagesize), 1);
    const q = new RegExp(ctx.query.q as string, 'i');
    ctx.body = await QuestionModel.find({ $or: [{ title: q }, { description: q }] })
      .limit(pageSize)
      .skip(page * pageSize);
  }

  async checkQuestionExists(ctx: Context, next: Next) {
    const question = await QuestionModel.findById(ctx.params.id).select('+questioner');
    if (!question) {
      ctx['throw'](404, 'question not exsits');
    }
    // 把问题放在state里
    ctx.state.question = question;
    await next();
  }

  async findById(ctx: Context) {
    const { fields = '' } = ctx.query;
    const selectFields = (fields as string)
      .split(';')
      .filter((f: any) => f)
      .map((f: string) => ` +${f}`)
      .join('');
    const question = await QuestionModel.findById(ctx.params.id)
      .select(selectFields)
      .populate('questioner topics');
    ctx.body = question;
  }

  async create(ctx: Context) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
    });
    const question = await new QuestionModel({
      ...ctx.request.body,
      questioner: ctx.state.user._id,
    }).save();
    ctx.body = question;
  }

  async checkQuestioner(ctx: Context, next: Next) {
    const { question } = ctx.state;
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx['throw'](403, 'No Access Right');
    }
    await next();
  }

  async update(ctx: Context) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
      topics: { type: 'array', itemType: 'string', required: false },
    });
    await ctx.state.question.updateOne(ctx.request.body);
    ctx.body = ctx.state.question;
  }

  async deleteById(ctx: Context) {
    await QuestionModel.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

export default new QuestionCtrl();
