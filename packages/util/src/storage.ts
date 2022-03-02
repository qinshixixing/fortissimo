import { detectIE } from './index';

export function createProxyStorage(
  initData: { [propName: string]: any },
  key = 'data'
): { [propName: string]: any } {
  let storage = {};
  try {
    storage = JSON.parse(localStorage.getItem(key) || '');
  } catch (e) {
    // todo
  }
  const merge = (
    obj: { [propName: string]: any },
    target: { [propName: string]: any }
  ) => {
    Object.keys(obj).forEach((key) => {
      // eslint-disable-next-line no-prototype-builtins
      if (target.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && typeof target[key] === 'object') {
          merge(obj[key], target[key]);
        }
      } else {
        target[key] = obj[key];
      }
    });
  };
  merge(initData, storage);
  const setHandle = () => {
    localStorage.setItem(key, JSON.stringify(storage));
  };
  if (detectIE()) {
    const queue: { [propName: string]: any }[] = [];
    const proxy = (obj: { [propName: string]: any }) => {
      const target = { ...obj };
      const handle: { [propName: string]: any } = {};
      Object.keys(obj).forEach((k) => {
        handle[k] = {
          get() {
            let v = target[k];
            if (v && typeof v === 'object' && queue.indexOf(v) < 0) {
              v = target[k] = proxy(v);
              queue.push(v);
            }
            return v;
          },
          set(v: any) {
            if (target[k] === v) return true;
            if (v && typeof v === 'object' && queue.indexOf(v) < 0) {
              v = proxy(v);
              queue.push(v);
            }
            target[k] = v;
            setHandle();
            return true;
          }
        };
      });
      Object.defineProperties(obj, handle);
      return obj;
    };
    proxy(storage);
    return storage;
  } else {
    const queue = new WeakSet();
    const handle = {
      get(target: any, k: any) {
        let v = target[k];
        if (v && typeof v === 'object' && !queue.has(v)) {
          v = target[k] = new Proxy(v, handle);
          queue.add(v);
        }
        return v;
      },
      set(target: any, k: any, v: any) {
        if (target[k] === v) return true;
        if (v && typeof v === 'object' && !queue.has(v)) {
          v = new Proxy(v, handle);
          queue.add(v);
        }
        target[k] = v;
        setHandle();
        return true;
      }
    };
    return new Proxy<typeof storage>(storage, handle);
  }
}
