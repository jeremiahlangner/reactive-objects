export class Observed {
    _setter; // side effect(s) to call when object modified (e.g. render())
    _getter; // side effect(s) on object access
    constructor(obj, getter, setter) {
        this._setter = setter;
        this._getter = getter;
        const self = this;
        const handler = {
            get(target, key) {
                if (typeof target[key] === 'object' && target[key] !== null) {
                    if (!target._isProxy) {
                        target._isProxy = true;
                        return new Proxy(target[key], handler);
                    }
                    return target[key];
                }
                else {
                    self._getter(key);
                    return target[key];
                }
            },
            set(target, key, value) {
                if (target[key] === value)
                    return true;
                const old = target[key];
                target[key] = value;
                if (key !== '_isProxy')
                    self._setter(key, value, old);
                return true;
            }
        };
        const proxy = new Proxy(obj, handler);
        return proxy;
    }
}
