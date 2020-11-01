import Router from 'koa-router';
import jwt from 'koa-jwt';
import UserCtrl from '@/controller/user';
import TopicCtrl from '@/controller/topic';
import AnswerCtrl from '@/controller/answer';
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
  listQuestions,
  listLikingAnswers,
  likeAnswer,
  unDislikeAnswer,
  unlikeAnswer,
  listDislikingAnswers,
  dislikeAnswer,
  listCollectingAnswers,
  collectAnswer,
  unCollectAnswer,
} = UserCtrl;

const { checkTopicExists } = TopicCtrl;

const { checkAnswerExists } = AnswerCtrl;

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

router.get('/:id/questions', listQuestions);

// 赞答案
router.get('/:id/likingAnswers', listLikingAnswers);
router.put('/likingAnswers/:id', auth, checkAnswerExists, likeAnswer, unDislikeAnswer);
router['delete']('/:id/likingAnswers/:id', auth, checkAnswerExists, unlikeAnswer);

// 踩答案
router.get('/:id/dislikingAnswers', listDislikingAnswers);
router.put('/dislikingAnswers/:id', auth, checkAnswerExists, dislikeAnswer, unlikeAnswer);
router['delete']('/dislikingAnswers/:id', auth, checkAnswerExists, unDislikeAnswer);

// 答案收藏
router.get('/:id/collectingAnswers', listCollectingAnswers);
router.put('/collectingAnswers/:id', auth, checkAnswerExists, collectAnswer);
router['delete']('/collectingAnswers/:id', auth, checkAnswerExists, unCollectAnswer);

export default router;
