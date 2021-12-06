import CryptoJS from 'crypto-js';
import secretConfig from '@/config/secret';

const { CRYPTO_KEY, CRYPTO_IV } = secretConfig;

const key = CryptoJS.enc.Base64.parse(CRYPTO_KEY);
const iv = CryptoJS.enc.Base64.parse(CRYPTO_IV);

// 加密函数使用的CryptoJS的AES/CBC/pkcs7进行加密
export const encode = (content: string | CryptoJS.lib.WordArray) => {
  const res = CryptoJS.AES.encrypt(content, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  return res;
};

// 解密函数
export const decode = (content: string | CryptoJS.lib.CipherParams) => {
  const res = CryptoJS.AES.decrypt(content, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
  return res;
};
