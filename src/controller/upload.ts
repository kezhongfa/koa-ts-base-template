import path from 'path';
import { Context } from 'koa';

class UploadCtrl {
  index(ctx: Context) {
    ctx.body = '上传测试';
  }

  // 图片上传接口
  upload(ctx: Context) {
    // 获取上传图片对象(koa-body)
    const { file } = ctx.request.files as any;
    // 获取图片名和后缀名
    const basename = path.basename(file.path);
    ctx.body = {
      // 返回上传后文件的路径
      path: `${ctx.origin}/uploads/${basename}`,
    };
  }
}

export default new UploadCtrl();
