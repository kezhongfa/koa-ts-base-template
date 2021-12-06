import Router from '@koa/router';

const router = new Router({
  prefix: '/v1/book',
});
router.get('/list', (ctx) => {
  ctx.body = {
    code: 0,
    data: 'booklist',
  };
});

router.get('/dataError', (ctx) => {
  ctx.body = {
    code: -1,
    msg: 'dataError',
  };
});

router.get('/httpError', (ctx) => {
  // eslint-disable-next-line no-magic-numbers
  ctx['throw'](401, 'httpError');
});

export default router;
