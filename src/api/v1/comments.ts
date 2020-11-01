import Router from 'koa-router';
import jwt from 'koa-jwt';

import commentCtrl from '@/controller/comments';
import config from '@/config/jwt';

const { secret } = config;
const {
  find,
  create,
  findById,
  update,
  deleteById,
  checkCommentExists,
  checkCommentator,
} = commentCtrl;
const router = new Router({ prefix: '/questions/:questionId/answers/:answerId/comments' });

const auth = jwt({ secret });

router.get('/', find);

router.post('/', auth, create);

router.get('/:id', checkCommentExists, findById);

router.patch('/:id', auth, checkCommentExists, checkCommentator, update);
router['delete']('/:id', auth, checkCommentExists, checkCommentator, deleteById);

export default router;
