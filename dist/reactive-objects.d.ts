export declare class ReactiveObject {
    private object;
    effects: {
        [hash: string]: (data: any) => void;
    };
    constructor(object: {
        [key: string]: any;
    }, getter?: (key: string) => any, setter?: (key: string, val: any, old?: any) => void);
    private getter;
    private setter;
    setObject(object: {
        [key: string]: any;
    }): void;
    registerEffect(effect: (data: unknown) => void): string;
    removeEffect(hash: string): void;
}
