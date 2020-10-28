import Router from 'koa-router';
import jwt from 'koa-jwt';

import Topics from '@/controllers/topics';
import config from '@/config/jwt';

const { find, create, findById, update } = Topics;
const { secret } = config;
const router = new Router({ prefix: '/v1/topics' });

const auth = jwt({ secret });

router.get('/', find);

router.post('/', auth, create);

router.get('/:id', findById);

router.patch('/:id', auth, update);

export default router;
