export class ReactiveObject {
    effects;
    constructor(obj) {
        const self = this;
        this.effects = {
            getEffects: {},
            setEffects: {}
        };
        const handler = {
            get(target, key, receiver) {
                if (key === self.registerEffect.name) {
                    return function () {
                        return self.registerEffect.apply(self, arguments);
                    };
                }
                if (key === self.removeEffect.name) {
                    return function () {
                        return self.removeEffect.apply(self, arguments);
                    };
                }
                if (typeof target[key] === "object" && target[key] !== null) {
                    if (!target._isProxy) {
                        target._isProxy = true;
                        return new Proxy(target[key], handler);
                    }
                    return target[key];
                }
                else {
                    for (const h in self.effects.getEffects) {
                        self.effects.getEffects[h].apply(self, [key]);
                    }
                    return target[key];
                }
            },
            set(target, key, value) {
                if (target[key] === value)
                    return true;
                const old = target[key];
                target[key] = value;
                if (key !== "_isProxy" && key !== self.registerEffect.name && key !== self.removeEffect.name) {
                    for (const h in self.effects.setEffects) {
                        self.effects.setEffects[h].apply(self, [key, value, old]);
                    }
                }
                return true;
            },
        };
        const proxy = new Proxy(obj, handler);
        return proxy;
    }
    // syntactic convention to  discourage overwriting while coding?
    registerEffect(effect, type) {
        const effects = type === 'get' ? this.effects.getEffects : this.effects.setEffects;
        let hash;
        do {
            hash = Math.random().toString(16).substring(2, 15);
        } while (effects[hash]);
        effects[hash] = effect;
        return hash;
    }
    removeEffect(hash, type) {
        const effects = type === 'get' ? this.effects.getEffects : this.effects.setEffects;
        delete effects[hash];
    }
}