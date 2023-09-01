# Reactive Objects

Reactive Objects is a class wrapper for your TypeScript objects that allows objects to trigger side effects on normal data changes. Simply initialize your object as a reactive object. Register your side effect functions, then simply access and reassign values as usual with side effects to follow.

## Usage

```TypeScript
import { ReactiveObject } from 'reactive-objects';

const foo = { bar: 'baz' };
const fooEffects = new ReactiveObject(foo);
fooEffects.registerEffect(() => console.log(foo.bar));

foo.bar = 'hello world';
// should log 'hello world';
```

Effects can be registered and removed.

```TypeScript
const effectHash = reactiveObject.registerEffect(() => {});
reactiveObject.removeEffect(effectHash);
```

Pass a custom getter or setter function to the ReactiveObject class. (For example, log every time a particular property member is accessed.)

```TypeScript
function getter(key: string): void {
}

function setter(key: string, val: any, old: any) {
}

const foo = { hello: 'world' }; 
const fooReactor = new ReactiveObject(foo, getter, setter);
fooReactor.registerEffect((data) => console.log(data));

// log access to foo.hello
foo.hello;
```
