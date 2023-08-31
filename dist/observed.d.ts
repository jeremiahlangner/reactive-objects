export declare class Observed<T> {
    _setter: (key: string, value: any, old: any) => void;
    _getter: (key: string) => unknown;
    constructor(obj: T, getter: (key: string) => unknown, setter: (key: string, value: any, old: any) => void);
}
