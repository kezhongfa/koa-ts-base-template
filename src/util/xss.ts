/* eslint-disable no-magic-numbers */
/* eslint-disable implicit-arrow-linebreak */
import xss, { IFilterXSSOptions } from 'xss';
import { isArray, isObject } from '@/util/type';

const xssDefaultOptions = {} as IFilterXSSOptions;

export const customXss = (html: string, options?: IFilterXSSOptions) =>
  xss(html, options || xssDefaultOptions);

export const xssJsonIgnoreField = (target: Record<string, any>, fields?: string[]) => {
  if (isObject(target)) {
    const _fields = fields || [];
    const hasFields = _fields.length > 0;
    return Reflect.ownKeys(target).reduce((pre, cur) => {
      let _cur = target[cur as string];
      if (!hasFields || !_fields.includes(cur as string)) {
        if (isObject(_cur)) {
          _cur = xssJsonIgnoreField(_cur);
        } else if (isArray(_cur) && _cur.length > 0) {
          _cur = _cur.map((item: string) => customXss(item));
        } else {
          _cur = customXss(_cur);
        }
      }
      return {
        ...pre,
        [cur]: _cur,
      };
    }, {});
  } else {
    return target;
  }
};

export const xssJsonIncludeField = (target: Record<string, any>, fields?: string[]) => {
  if (isObject(target)) {
    const _fields = fields || [];
    const hasFields = _fields.length > 0;
    return Reflect.ownKeys(target).reduce((pre, cur) => {
      let _cur = target[cur as string];
      if (!hasFields || _fields.includes(cur as string)) {
        if (isObject(_cur)) {
          _cur = xssJsonIncludeField(_cur);
        } else if (isArray(_cur) && _cur.length > 0) {
          _cur = _cur.map((item: string) => customXss(item));
        } else {
          _cur = customXss(_cur);
        }
      }
      return {
        ...pre,
        [cur]: _cur,
      };
    }, {});
  } else {
    return target;
  }
};
