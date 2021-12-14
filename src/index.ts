/* eslint-disable no-magic-numbers */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-console */
import Koa from 'koa';
import koaBody from 'koa-body';
import koaStatic from 'koa-static';
import jsonError from 'koa-json-error';
import requireDirectory from 'require-directory';
import favicon from 'koa-favicon';
import Router from '@koa/router';
import mongoose from 'mongoose';
import helmet from 'koa-helmet';
import ip from 'koa-ip';
import path from 'path';
import verifyParameter from './middleware/verify-paramter';
import config from '@/config/db';
import envConfig from '@/util/env';

const { isProd } = envConfig;

// 获取mongoose链接地址
const { mongoURIConfig, dbConfig } = config;
// 用mongoose连接数据库
const mongoURI = isProd ? mongoURIConfig.pro : mongoURIConfig.dev;
mongoose.connect(mongoURI, isProd ? dbConfig.pro : dbConfig.dev).then(
  () => console.log('数据库链接成功'),
  (err) => {
    console.error('数据库链接失败:', err);
  }
);
// 实例化Koa
const app = new Koa();
console.log('app:', app.env);

// json error中间件
app.use(
  jsonError({
    postFormat: (_e, { status, message, stack }) => {
      const result = {
        status: status || 500,
        success: false,
        data: null,
        message,
        stack,
      };
      if (isProd) {
        delete result.stack;
      }
      return result;
    },
  })
);

// IP名单过滤
app.use(
  ip({
    // blacklist: ['127.0.0.*'],
    handler: async (ctx) => {
      ctx.status = 403;
    },
  })
);

// 头盔
app.use(helmet());

// 加载静态资源中间件，public目录下的资源可以直接被访问
app.use(koaStatic(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'icon.png')));
// 加载koa-body中间件
app.use(
  koaBody({
    multipart: true, // 支持多文件上传
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      onFileBegin: (name, file) => {
        console.dir(`onFileBegin-name: ${name},file:${file}`);
      },
    },
  })
);
// 加载参数校验中间件
app.use(verifyParameter(app)); // 传入app，可以在ctx中加入方法，全局使用
// 注册所有的路由
requireDirectory(module, './api/v1', {
  visit: whenLoadModule,
  extensions: ['ts'],
});

function whenLoadModule(obj: NodeModule) {
  const routerInstance = obj['default'];
  if (routerInstance instanceof Router) {
    app.use(routerInstance.routes()).use(routerInstance.allowedMethods());
  }
}

const PORT = 4000;

app.listen(PORT, '0.0.0.0', () => {
  const url = `http://localhost:${PORT}`;
  console.info(`Listening at ${url}`);
});
