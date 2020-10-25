import Router from 'koa-router';
import jwt from 'koa-jwt';
import Users from '@/controllers/users';
import config from '@/config';

const { secret } = config;
const { find, findById, create, update, delete: del, login, checkOwner } = Users;
const auth = jwt({ secret });

const router = new Router({ prefix: '/v1/users' });

router.get('/', find);
router.post('/', create);
router.get('/:id', findById);
router.patch('/:id', auth, checkOwner, update);
router['delete']('/:id', auth, checkOwner, del);
router.post('/login', login);

export default router;
