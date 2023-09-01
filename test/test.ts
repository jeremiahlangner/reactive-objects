import { ReactiveObject } from '../src/reactive-object';

let state: any = new ReactiveObject({});
const hash = state.registerEffect((data: any) => {
  console.log('did a thing');
});
console.log('should invoke side effect');
state.b = 4;
console.log('did it');

