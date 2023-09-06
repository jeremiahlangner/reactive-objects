export declare class ReactiveObject<T> {
  private effects;
  constructor(obj: T, options?: Partial<EffectOptions>);
  registerEffect(
    effect: (data: any) => void,
    type?: "get" | "set" | null
  ): string;
  removeEffect(hash: string, type?: "get" | "set" | null): void;
}
export interface EffectOptions {
  full: boolean;
  all: boolean;
}
export interface GetEffectArguments {
  key: string;
}
export interface SetEffectArguments {
  key: string;
  value: any;
  old: any;
}
export interface Effects {
  options: Partial<EffectOptions>;
  getEffects: {
    [hash: string]: (args: GetEffectArguments) => void;
  };
  setEffects: {
    [hash: string]: (args: SetEffectArguments) => void;
  };
}
