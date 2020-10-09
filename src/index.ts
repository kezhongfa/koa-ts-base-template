/* eslint-disable no-console */
import Koa from 'koa';

const app = new Koa();
// eslint-disable-next-line no-magic-numbers
const port = process.env.PORT || 3000;
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

// 路由

app.listen(port);

console.log(`应用启动成功 端口:${port}`);
