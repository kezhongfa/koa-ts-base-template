import Router from '@koa/router';
import jwt from 'koa-jwt';

import Topic from '@/controller/topic';
import config from '@/config/jwt';

const {
  find,
  create,
  findById,
  update,
  checkTopicExists,
  listTopicFollowers,
  listQuestions,
} = Topic;
const { secret } = config;
const router = new Router({ prefix: '/v1/topics' });

const auth = jwt({ secret });

router.get('/', find);

router.post('/', auth, create);

router.get('/:id', checkTopicExists, findById);

router.patch('/:id', auth, checkTopicExists, update);

router.get('/:id/followers', auth, checkTopicExists, listTopicFollowers);

router.get('/:id/questions', auth, checkTopicExists, listQuestions);
export default router;
