import Router from 'koa-router';
import UploadCtrl from '@/controller/upload';

const { index, upload } = UploadCtrl;

const router = new Router({
  prefix: '/v1/upload',
});

router.get('/', index);
// 上传接口
router.post('/', upload);

export default router;
