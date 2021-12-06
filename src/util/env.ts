const ENV = process.env.NODE_ENV;

export default {
  isDev: ENV === 'develop',
  isProd: ENV === 'production',
  isTest: ENV === 'test',
};
