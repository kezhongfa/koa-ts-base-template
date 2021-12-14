const config = {
  mongoURIConfig: {
    dev: 'mongodb://127.0.0.1:27017',
    pro: 'mongodb://81.68.72.219:27017',
  },
  dbConfig: {
    dev: {
      dbName: 'kTest',
      connectTimeoutMS: 1000,
      bufferCommands: false, // 禁用缓存
      autoIndex: false, // 索引建立会导致性能下降
    },
    pro: {
      dbName: 'zhihu',
      auth: {
        username: 'kzf',
        password: 'kezhongfa',
      },
      authSource: 'zhihu',
      // user: 'kzf',
      // pass: 'kezhongfa',
      connectTimeoutMS: 2000,
      bufferCommands: false, // 禁用缓存
      autoIndex: false, // 索引建立会导致性能下降
      keepAlive: true, // 默认是true, 对于长期运行的后台应用，启用毫秒级 keepAlive 是一个精明的操作。不这么做你可能会经常 收到看似毫无原因的 "connection closed" 错误
    },
  },
};
export default config;
