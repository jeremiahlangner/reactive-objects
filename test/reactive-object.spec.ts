import { ReactiveObject } from '../src/reactive-object';

test('registered effect will execute.', () => {
  let t = '';
  const foo: any = new ReactiveObject({});
  foo.registerEffect(() => t = 'hello');
  foo.bar = 'baz';
  expect(t).toBe('hello');
});

test('registered effect should have a hash.', () => {
  const foo = new ReactiveObject({});
  const hash = foo.registerEffect(() => {});
  expect(hash).not.toBeNull;
});

test('should remove a registered effect.', () => {
  let bar = 0;
  const foo: any = new ReactiveObject({});
  const hash = foo.registerEffect(() => bar = 5); 
  foo.removeEffect(hash);
  foo.baz = 'hello';
  expect(bar).toBe(0);
});

test('should register a get effect', () => {
  let bar = 0;
  const foo: any = new ReactiveObject({});
  foo.registerEffect(() => bar = 5, 'get');
  foo.bar;
  expect(bar).toBe(5);
});

