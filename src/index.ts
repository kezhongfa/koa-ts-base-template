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
import Router from 'koa-router';
import parameter from 'koa-parameter';
import path from 'path';

const app = new Koa();
app.use(
  jsonError({
    postFormat: (_e, { stack, ...rest }) => {
      const common = {
        success: false,
      };
      return process.env.NODE_ENV === 'production'
        ? { rest, ...common }
        : { stack, ...rest, ...common };
    },
  })
);
app.use(koaStatic(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'icon.png')));

app.use(
  koaBody({
    multipart: true, // 支持文件上传
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      onFileBegin: (name, file) => {
        console.log(`name: ${name},file:${file}`);
      },
    },
  })
);
app.use(parameter(app)); // 传入app，可以在ctx中加入方法，全局使用

requireDirectory(module, './mocks/api/v1', {
  visit: whenLoadModule,
  extensions: ['ts', 'js'],
});

function whenLoadModule(obj: any) {
  const routerInstance = obj['default'];
  if (routerInstance instanceof Router) {
    app.use(routerInstance.routes());
  }
}

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
  const url = `http://localhost:${PORT}`;
  console.info(`Listening at ${url}`);
  // console.log("app:", module.filename, path.dirname(module.filename));
});
