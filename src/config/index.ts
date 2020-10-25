const config = {
  mongoURI: 'mongodb://localhost:27017',
  secret: 'kTest',
  dbConfig: {
    dev: {
      dbName: 'kTest',
      connectTimeoutMS: 1000,
      bufferCommands: false,
      autoIndex: false,
    },
    pro: {
      dbName: 'kTest',
      connectTimeoutMS: 2000,
      bufferCommands: false,
      autoIndex: false,
      poolSize: 8,
    },
  },
};
export default config;
