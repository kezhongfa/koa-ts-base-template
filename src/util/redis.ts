/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
import redis from 'redis';
import config from '@/config/redis';
import envConfig from '@/util/env';

const { isProd } = envConfig;
const REDIS_CONF = isProd ? config.redisConfig.pro : config.redisConfig.dev;

const { port, host } = REDIS_CONF;

// 创建客户端
const redisClient = redis.createClient(port, host);
redisClient.on('error', (err) => {
  console.error('redis error:', err);
});

export function set(key: string, val: string, timeout: number = 60 * 60) {
  let _val = val;
  if (typeof _val === 'object') {
    _val = JSON.stringify(val);
  }
  redisClient.set(key, _val);
  redisClient.expire(key, timeout);
}

export function get(key: string) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err);
        return;
      }
      if (val == null) {
        resolve(null);
        return;
      }

      try {
        resolve(JSON.parse(val));
      } catch (ex) {
        resolve(val);
      }
    });
  });
  return promise;
}
