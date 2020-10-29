import Router from 'koa-router';
import jwt from 'koa-jwt';
import UserCtrl from '@/controller/user';
import TopicCtrl from '@/controller/topic';
import config from '@/config/jwt';

const { secret } = config;
const {
  find,
  findById,
  create,
  update,
  delete: del,
  login,
  checkOwner,
  checkUserExist,
  listFollowing,
  listFollowers,
  follow,
  unfollow,
  listFollowingTopics,
  followTopic,
  unfollowTopic,
} = UserCtrl;

const { checkTopicExists } = TopicCtrl;
const auth = jwt({ secret });

const router = new Router({ prefix: '/v1/users' });

router.get('/', find);
router.post('/', create);
router.get('/:id', findById);
router.patch('/:id', auth, checkOwner, update);
router['delete']('/:id', auth, checkOwner, del);
router.post('/login', login);
router.get('/:id/following', listFollowing);
router.get('/:id/followers', listFollowers);

router.put('/following/:id', auth, checkUserExist, follow);
router['delete']('/following/:id', auth, checkUserExist, unfollow);

router.get('/:id/followingTopics', listFollowingTopics);
router.put('/followingTopics/:id', auth, checkTopicExists, followTopic);
router['delete']('/followingTopics/:id', auth, checkTopicExists, unfollowTopic);
export default router;
