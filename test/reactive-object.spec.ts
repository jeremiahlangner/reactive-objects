import {
  ReactiveObject,
  SetEffectArguments,
  GetEffectArguments,
} from "../src/reactive-object";

test("should register a get effect", () => {
  let bar = 0;
  const foo: any = new ReactiveObject({});
  foo.registerEffect(() => (bar = 5), "get");
  foo.bar;
  expect(bar).toBe(5);
});

test('should register a "set" effect by default', () => {
  let t = "";
  const foo: any = new ReactiveObject({});
  foo.registerEffect(() => (t = "hello"));
  foo.bar = "baz";
  expect(t).toBe("hello");
});

test('should register a "set" effect with a "set" argument', () => {
  let t = "";
  const foo: any = new ReactiveObject({});
  foo.registerEffect(() => (t = "hello"), "set");
  foo.bar = "baz";
  expect(t).toBe("hello");
});

test("registered effect should have a hash.", () => {
  const foo = new ReactiveObject({});
  const hash = foo.registerEffect(() => {});
  expect(hash).not.toBeNull;
});

test("should remove a registered effect.", () => {
  let bar = 0;
  const foo: any = new ReactiveObject({});
  const hash = foo.registerEffect(() => (bar = 5));
  foo.removeEffect(hash);
  foo.baz = "hello";
  expect(bar).toBe(0);
});

test("get effect should pass the key name", () => {
  let bar = "";
  const foo: any = new ReactiveObject({});
  foo.registerEffect(({ key }: GetEffectArguments) => (bar = key), "get");
  foo.bar;
  expect(bar).toBe("bar");
});

test("set effect should should pass respective variables", () => {
  let _key = "";
  let _val = "";
  let _old = "";

  const foo: any = new ReactiveObject({ bar: "baz" });
  foo.registerEffect(({ key, value, old }: SetEffectArguments) => {
    _key = key;
    _val = value;
    _old = old;
  });
  foo.bar = "lur";
  expect(_key).toBe("bar");
  expect(_val).toBe("lur");
  expect(_old).toBe("baz");
});

test("no effect execution if causes infinite loop", () => {
  let getRes: any;
  const foo: any = new ReactiveObject({});
  foo.registerEffect(({ key }: GetEffectArguments) => {
    foo[key];
    getRes = "foo";
  });
  foo.bar;
  expect(getRes).toBe(undefined);
});
