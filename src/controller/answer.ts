/* eslint-disable prefer-destructuring */
/* eslint-disable no-magic-numbers */
/* eslint-disable require-atomic-updates */
import { Context, Next } from 'koa';
import AnswerModel from '@/model/answer';

class AnswerCtrl {
  async find(ctx: Context) {
    const { pagesize = 10, page = 1 } = ctx.query;
    const _page = Math.max(Number(page), 1) - 1;
    const _pageSize = Math.max(Number(pagesize), 1);

    const q = new RegExp(ctx.query.q, 'i');
    ctx.body = await AnswerModel.find({ content: q, questionId: ctx.params.questionId })
      .limit(_pageSize)
      .skip(_page * _pageSize);
  }

  async checkAnswerExists(ctx: Context, next: Next) {
    const answer = (await AnswerModel.findById(ctx.params.id).select('+answerer')) as any;
    if (!answer) {
      ctx['throw'](404, 'answer not exsits');
    }
    // 赞和踩答案不检查
    if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) {
      ctx['throw'](404, '该问题下没有此答案');
    }
    ctx.state.answer = answer;
    await next();
  }

  async findById(ctx: Context) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((f: any) => f)
      .map((f: string) => ` +${f}`)
      .join('');
    const answer = await AnswerModel.findById(ctx.params.id)
      .select(selectFields)
      .populate('answerer');
    ctx.body = answer;
  }

  async create(ctx: Context) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    });
    const answerer = ctx.state.user._id;
    const questionId = ctx.params.questionId;
    const answer = await new AnswerModel({ ...ctx.request.body, answerer, questionId }).save();
    ctx.body = answer;
  }

  async checkAnswerer(ctx: Context, next: Next) {
    const { answer } = ctx.state;
    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx['throw'](403, 'No Access Right');
    }
    await next();
  }

  async update(ctx: Context) {
    ctx.verifyParams({
      content: { type: 'string', required: false },
    });
    await ctx.state.answer.updateOne(ctx.request.body);
    ctx.body = ctx.state.answer;
  }

  async deleteById(ctx: Context) {
    await AnswerModel.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

export default new AnswerCtrl();
