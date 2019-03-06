import throttle from 'lodash.throttle';

/**
 * 函数节流
 * @param time  default 500ms
 */
export function Throttle(time: number = 500) {
  return function(target, propertyKey, descriptor: PropertyDescriptor) {
    descriptor.value = throttle(descriptor.value, time, { leading: false });
  };
}

/**
 * TryCatch装饰器
 * @param errFunc 异常处理回调
 */
export function TryCatch(errFunc?: (ctx, err: Error) => void): MethodDecorator {
  return function(target, propertyKey, descriptor: PropertyDescriptor) {
    let method = descriptor.value;
    descriptor.value = async function() {
      try {
        await method.apply(this, arguments);
      } catch (error) {
        if (errFunc) {
          errFunc(this, error);
        } else {
          throw error;
        }
      }
    };
  };
}
// alias for TryCatch
export const Catch = TryCatch;

export const assert = (condition, msg) => {
  if (!condition) {
    throw new Error(msg);
  }
};

export const expect200 = res => {
  if (res && res.code && res.code === 200) return;
  throw new Error(res.message);
};