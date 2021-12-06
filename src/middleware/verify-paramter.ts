/* eslint-disable no-magic-numbers */
/* eslint-disable no-param-reassign */
import Application, { Context, Next } from 'koa';
import Parameter, { ParameterRules, ParameterTranslateFunction } from 'parameter';

export default function (app: Application, translate?: ParameterTranslateFunction) {
  let parameter: Parameter;

  if (typeof translate === 'function') {
    parameter = new Parameter({
      translate,
    });
  } else {
    parameter = new Parameter();
  }

  app.context.verifyParams = function (rules: ParameterRules, params: unknown) {
    if (!rules) {
      return;
    }

    if (!params) {
      params = ['GET', 'HEAD'].includes(this.method.toUpperCase())
        ? this.request.query
        : this.request.body;

      // copy
      params = Object.assign({}, params, this.params);
    }
    const errors = parameter.validate(rules, params);
    if (!errors) {
      return;
    }
    this['throw'](422, 'Validation Failed', {
      code: 'INVALID_PARAM',
      errors,
      params,
    });
  };

  return async function verifyParam(ctx: Context, next: Next) {
    try {
      await next();
    } catch (err: any) {
      if (err.code === 'INVALID_PARAM') {
        ctx.status = 422;
        ctx.body = {
          message: err.message,
          errors: err.errors,
          params: err.params,
        };
        return;
      }
      throw err;
    }
  };
}
