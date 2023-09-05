export class ReactiveObject<T> {
  private store: T;
  private effects: Partial<{
    options: Partial<EffectOptions>,
    getEffects: { [hash: string]: (key: string) => void },
    setEffects: { [hash: string]: (key: string, val: any, old?: any) => void }
  }>;

  constructor(
    obj: T,
    options?: Partial<EffectOptions>
  ) {
    const self = this;
    this.store = obj;
    
    this.effects = {
      options,
      getEffects: {},
      setEffects: {}
    };

    const handler = {
      get(target: any, key: string, receiver: any): any {
        if (target == self) return;

        if (key === self.registerEffect.name) {
          return function() {
            return self.registerEffect.apply(self, arguments as any);
          }
        }

        if (key === self.removeEffect.name) {
          return function() {
            return self.removeEffect.apply(self, arguments as any);
          }
        }

        if (typeof target[key] === "object" && target[key] !== null) {
          if (!target._isProxy) {
            target._isProxy = true;
            return new Proxy(target[key], handler);
          }
          return target[key];
        } else {
          for(const h in self.effects.getEffects) {
            self.effects.getEffects[h].apply(self, [key]);
          }
          return target[key];
        }
      },
      set(target: any, key: string, value: any): boolean {
        // prevent effect execution if same value; TODO: allow to be configurable
        if (target[key] === value) return true;

        if (key === Object.getPrototypeOf(self.effects).name) {
          return false;
        }

        const old = target[key];
        target[key] = value;
        if (
          key !== "_isProxy" 
          && key !== self.registerEffect.name 
          && key !== self.removeEffect.name
        ) {
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

  registerEffect(effect: (data: any)  => void, type?: 'get' | 'set' | null) {
    const effects = type === 'get' ? this.effects.getEffects : this.effects.setEffects;
    let hash: string;
    do {
      hash = Math.random().toString(16).substring(2,15);
    } while (effects![hash]);
    effects![hash] = effect;
    return hash;
  }

  removeEffect(hash: string, type?: 'get' | 'set' | null) {
    const effects = type === 'get' ? this.effects.getEffects : this.effects.setEffects;
    delete effects![hash];
  }
}

interface EffectOptions {
  full: boolean;
  all: boolean;
}

interface GetEffectArguments {
  key: string;
  val: any;
  data: any;
}

interface SetEffectArguments {
  key: string;
  val: any;
  old: any;
  data: any;
}

interface Effects {
  options: Partial<EffectOptions>;
  getEffects: { [hash: string ]: (args: GetEffectArguments) => void };
  setEffects: { [hash: string ]: (args: SetEffectArguments) => void };
}


