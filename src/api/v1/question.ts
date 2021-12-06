import Router from '@koa/router';
import jwt from 'koa-jwt';

import QuestionCtrl from '@/controller/question';
import config from '@/config/jwt';

const { secret } = config;

const {
  find,
  create,
  findById,
  update,
  deleteById,
  checkQuestionExists,
  checkQuestioner,
} = QuestionCtrl;

const router = new Router({ prefix: '/v1/questions' });

const auth = jwt({ secret });

router.get('/', find);

router.post('/', auth, create);

router.get('/:id', checkQuestionExists, findById);

router.patch('/:id', auth, checkQuestionExists, checkQuestioner, update);
router['delete']('/:id', auth, checkQuestionExists, checkQuestioner, deleteById);

export default router;
