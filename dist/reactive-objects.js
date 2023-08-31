import { Observed } from './observed';
export class ReactiveObject {
    object;
    effects;
    constructor(object, getter, setter) {
        this.effects = {};
        this.getter = getter || this.getter;
        this.setter = setter || this.setter;
        this.object = new Observed({}, this.getter, this.setter);
        this.setObject(object);
    }
    // by default does nothing when a property is accessed;
    // may be a good place to register a debugger/logger
    getter(key) {
        return this.object[key];
    }
    // by default will not execute effects unless the value has changed
    setter(key, val, old) {
        if (!old || old !== val) {
            for (const hash in this.effects) {
                this.effects[hash](this.object);
            }
        }
    }
    // set initial object or replace entire object type
    setObject(object) {
        if (!object)
            return;
        // replace object
        this.object = new Observed({}, this.getter, this.setter);
        for (const key in object) {
            if (this.object[key] === object[key])
                return;
            this.object[key] = object[key];
        }
    }
    // register a side effect
    registerEffect(effect) {
        let hash;
        do {
            hash = Math.random().toString(16).substring(2, 15);
        } while (this.effects[hash]);
        this.effects[hash] = effect;
        return hash;
    }
    // remove a side effect
    removeEffect(hash) {
        delete this.effects[hash];
    }
}
