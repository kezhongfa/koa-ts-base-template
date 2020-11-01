import Router from 'koa-router';
import jwt from 'koa-jwt';

import AnswerCtrl from '@/controller/answer';
import config from '@/config/jwt';

const { secret } = config;
const { find, create, findById, update, deleteById, checkAnswerExists, checkAnswerer } = AnswerCtrl;
const router = new Router({ prefix: '/v1/questions/:questionId/answers' });

const auth = jwt({ secret });

router.get('/', find);

router.post('/', auth, create);

router.get('/:id', checkAnswerExists, findById);

router.patch('/:id', auth, checkAnswerExists, checkAnswerer, update);
router['delete']('/:id', auth, checkAnswerExists, checkAnswerer, deleteById);

export default router;
