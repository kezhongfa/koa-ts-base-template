const config = {
  mongoURI: 'mongodb://localhost:27017',
  dbConfig: {
    dev: {
      dbName: 'kTest',
      connectTimeoutMS: 1000,
      bufferCommands: false, // 禁用缓存
      autoIndex: false, // 索引建立会导致性能下降
    },
    pro: {
      dbName: 'kTest',
      connectTimeoutMS: 2000,
      bufferCommands: false, // 禁用缓存
      autoIndex: false, // 索引建立会导致性能下降
      poolSize: 8, // 默认值是 5
      keepAlive: true, // 对于长期运行的后台应用，启用毫秒级 keepAlive 是一个精明的操作。不这么做你可能会经常 收到看似毫无原因的 "connection closed" 错误
    },
  },
};
export default config;
