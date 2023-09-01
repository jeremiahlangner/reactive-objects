# Reactive Objects

Reactive Objects is a simple class wrapper for your TypeScript objects that allows objects to trigger side effects on normal data changes or access. Simply initialize your object as a reactive object. Register your side effect functions, then simply access and reassign values as usual with side effects to follow.

## Usage

```TypeScript
import { ReactiveObject } from 'reactive-object';

const foo: any = new ReactiveObject({});
foo.registerEffect(() => console.log('bar'));

// should log 'bar'.
foo.bar = 'hello world';
```

Effects can be registered and removed.

```TypeScript
const foo: any = new ReactiveObject({]);
const hash = foo.registerEffect(() => console.log('hello'));
foo.removeEffect(hash);

// should not log 'hello'
foo.bar = 'baz';
```

Add a getter effect (for example, a logger for property access).

```TypeScript
const foo: any = new ReactiveObject({ bar: 'baz' });
foo.registerEffect((key: string) => console.log(key), 'get');

// should log 'bar'
foo.bar;
```

Don't create infinite loops.

```TypeScript
const foo: any = new ReactiveObject({ bar: 'baz' });
// will blow out the call stack...
foo.registerEffect((key: string) => console.log(foo[key]), 'get');
```

