interface EffectOptions {
    full: boolean;
    all: boolean;
}
export declare class ReactiveObject<T> {
    private effects;
    constructor(obj: T, options?: Partial<EffectOptions>);
    registerEffect(effect: (data: any) => void, type?: 'get' | 'set' | null): string;
    removeEffect(hash: string, type?: 'get' | 'set' | null): void;
}
export {};
