export function isTypeMatched(data: any, type: string) {
  return Object.prototype.toString.call(data) === type;
}

export const isString = (data: any) => {
  return isTypeMatched(data, '[object String]');
};

export const isArray = (data: any) => {
  return isTypeMatched(data, '[object Array]');
};

export const isObject = (data: any) => {
  return isTypeMatched(data, '[object Object]');
};

export const isNumber = (data: any) => {
  return isTypeMatched(data, '[object Number]');
};

export const isBoolean = (data: any) => {
  return isTypeMatched(data, '[object Boolean]');
};
