import { Observed } from "./observed";

export class ReactiveObject {
  private object: Observed<{ [key: string]: any }>;
  public effects: {
    [hash: string]: (data: any) => void;
  };

  constructor(
    // object: { [key: string]: any },
  ) {
    this.effects = {};

    // by default does nothing when a property is accessed;
    // may be a good place to register a debugger/logger
    const getter = (key: string) => console.log(key);

    // by default will not execute effects unless the value has changed
    const setter = (key: string, val: any, old?: any) => {
        console.log(key, val, old);
        if (!old || old !== val) {
          for (const hash in this.effects) {
            this.effects[hash](this.object);
          }
        }
      };

    this.object = new Observed({}, getter, setter);
    //this.setObject(object);
  }

  // set initial object or replace entire object type
  public setObject(object: { [key: string]: any }) {
    if (!object) return;

    for (const key in object) {
      if (this.object[key as keyof typeof this.object] === object[key]) return;
      this.object[key as keyof typeof this.object] = object[key];
    }
  }

  // register a side effect
  public registerEffect(effect: (data: unknown) => void): string {
    let hash: string;
    do {
      hash = Math.random().toString(16).substring(2, 15);
    } while (this.effects[hash]);
    this.effects[hash] = effect;
    return hash;
  }

  // remove a side effect
  public removeEffect(hash: string) {
    delete this.effects[hash];
  }
}
