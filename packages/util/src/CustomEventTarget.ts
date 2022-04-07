export type CustomEventCallback = (...params: any[]) => void;
export type CustomEventListeners = Set<CustomEventCallback>;
export type AllCustomEventListeners = Map<string, CustomEventListeners>;

export class CustomEventTarget {
  _listeners: AllCustomEventListeners;

  constructor() {
    this._listeners = new Map();
  }

  _initEventListeners(event: string): CustomEventListeners {
    const listeners: CustomEventListeners = new Set();
    this._listeners.set(event, listeners);
    return listeners;
  }

  hasListener(event: string, callback: CustomEventCallback): boolean {
    const listeners = this._listeners.get(event);
    if (!listeners) return false;
    return listeners.has(callback);
  }

  addListener(event: string, callback: CustomEventCallback): void {
    let listeners = this._listeners.get(event);
    if (!listeners) listeners = this._initEventListeners(event);
    listeners.add(callback);
  }

  addOnceListener(event: string, callback: CustomEventCallback): void {
    let listeners = this._listeners.get(event);
    if (!listeners) listeners = this._initEventListeners(event);
    const realCb = (...args: []) => {
      callback.apply(this, args);
      // callback.apply(null, args);
      listeners && listeners.delete(realCb);
    };
    listeners.add(realCb);
  }

  removeListener(event: string, callback: CustomEventCallback): void {
    const listeners = this._listeners.get(event);
    if (!listeners) return;
    listeners.delete(callback);
  }

  clearListener(event: string): void {
    if (!event) this._listeners.clear();
    else {
      const listeners = this._listeners.get(event);
      if (!listeners) return;
      listeners.clear();
    }
  }

  dispatch(event: string, ...params: any[]): void {
    if (!event) return;
    const listeners = this._listeners.get(event);
    if (!listeners) return;
    listeners.forEach((listener) => {
      listener(...params);
    }, null);
  }
}

export type CustomEventTargetInstance = InstanceType<typeof CustomEventTarget>;
