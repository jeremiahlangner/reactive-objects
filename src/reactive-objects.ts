import { Observed } from './observed';

export class ReactiveObject {
  private object: Observed<{[key: string]: any}>;
  public effects: {
    [hash: string]: (data: any) => void
  };

  constructor(
    object: {[key: string]: any}, 
    getter?: (key: string) => any,
    setter?: (key: string, val: any, old?: any) => void
  ) {
    this.effects = {};

    this.getter = getter || this.getter;
    this.setter = setter || this.setter;
    this.object = new Observed({}, this.getter, this.setter);
    this.setObject(object);
  }

  // by default does nothing when a property is accessed;
  // may be a good place to register a debugger/logger
  private getter(key: string): any {
    return this.object[key as keyof typeof this.object]; 
  }

  // by default will not execute effects unless the value has changed
  private setter(key: string, val: unknown, old?: unknown): void {
    if(!old || old !== val) {
      for (const hash in this.effects) {
        this.effects[hash](this.object);
      }
    }
  }

  // set initial object or replace entire object type
  public setObject(object: {[key: string]: any}) {
    if (!object) return;

    // replace object
    this.object = new Observed({}, this.getter, this.setter);

    for (const key in object) {
      if (this.object[key as keyof typeof this.object] === object[key]) return;
      this.object[key as keyof typeof this.object] = object[key];
    }
  }

  // register a side effect
  public registerEffect(effect: (data: unknown) => void): string {
    let hash: string;
    do {
      hash = Math.random().toString(16).substring(2,15);
    } while (this.effects[hash]);
    this.effects[hash] = effect;
    return hash;
  }

  // remove a side effect
  public removeEffect(hash: string) {
    delete this.effects[hash];
  }
}

