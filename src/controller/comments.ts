/* eslint-disable no-magic-numbers */
/* eslint-disable require-atomic-updates */
import { Context, Next } from 'koa';
import CommentModel from '@/model/comment';

class CommentController {
  async find(ctx: Context) {
    const { pagesize = 10 } = ctx.query;
    const page = Math.max(Number(ctx.query.page), 1) - 1;
    const pageSize = Math.max(Number(pagesize), 1);
    const q = new RegExp(ctx.query.q, 'i');
    const { questionId, answerId } = ctx.params;
    const { rootCommentId } = ctx.query;
    ctx.body = await CommentModel.find({ content: q, questionId, answerId, rootCommentId })
      .limit(pageSize)
      .skip(page * pageSize)
      .populate('commentator replyTo');
  }

  async checkCommentExists(ctx: Context, next: Next) {
    const comment = (await CommentModel.findById(ctx.params.id).select('+commentator')) as any;
    if (!comment) {
      ctx['throw'](404, 'comment not exsits');
    }
    // 赞和踩答案不检查
    if (ctx.params.questionId && comment.questionId !== ctx.params.questionId) {
      ctx['throw'](404, '该问题下没有此评论');
    }
    if (ctx.params.answerId && comment.answerId !== ctx.params.answerId) {
      ctx['throw'](404, '该答案下没有此评论');
    }
    ctx.state.comment = comment;
    await next();
  }

  async findById(ctx: Context) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((f: any) => f)
      .map((f: string) => ` +${f}`)
      .join('');
    const comment = await CommentModel.findById(ctx.params.id)
      .select(selectFields)
      .populate('commentator');
    ctx.body = comment;
  }

  async create(ctx: Context) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: false },
      replyTo: { type: 'string', required: false },
    });
    const commentator = ctx.state.user._id;
    const { questionId, answerId } = ctx.params;
    const comment = await new CommentModel({
      ...ctx.request.body,
      commentator,
      questionId,
      answerId,
    }).save();
    ctx.body = comment;
  }

  async checkCommentator(ctx: Context, next: Next) {
    const { comment } = ctx.state;
    if (comment.commentator.toString() !== ctx.state.user._id) {
      ctx['throw'](403, 'No Access Right');
    }
    await next();
  }

  async update(ctx: Context) {
    ctx.verifyParams({
      content: { type: 'string', required: false },
    });
    // 只允许更新content属性
    const { content } = ctx.request.body;

    // findByIdAndUpdate 返回的 comment 是更新前的
    await ctx.state.comment.updateOne({ content });
    ctx.body = ctx.state.comment;
  }

  async deleteById(ctx: Context) {
    await CommentModel.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

export default new CommentController();
