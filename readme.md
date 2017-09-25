# p-auto [![Build Status](https://travis-ci.org/DerTieran/p-auto.svg?branch=master)](https://travis-ci.org/DerTieran/p-auto)
> Like [`async.auto()`](https://caolan.github.io/async/docs.html#auto) but for `Promise`

Useful when you need to run multiple promises concurrently which have different dependencies between each other.

## Install

```sh
$ npm install --save p-auto
```


## Usage

```js
const pAuto = require('p-auto');

const tasks = {
  foo: 1,
  bar: () => Promise.resolve(2),
  faz: ['foo', 'bar', result => result.foo + result.bar]
};

pAuto(tasks).then(result => {
  console.log(result);
  //=> {foo: 1, bar: 2, faz: 3}
});
```


## API

### pAuto(tasks)

Returns a `Promise` that is fulfilled when all `tasks` are fulfilled, or rejects if any of the `tasks` reject. The fulfilled value is the same as `tasks`, but with a fulfilled version of each entry value.

#### tasks

Type: `Object`

The entry value can either be a `resolver` or an array of dependencies, with the `resolver` being the last value. A `resolver` can either be a value or a function that will be passed the result of the defined dependencies.

## Related

- [p-props](https://github.com/sindresorhus/p-props) - Like `Promise.all()` but for `Map` and `Object`
- [p-defer](https://github.com/sindresorhus/p-defer) - Create a deferred promise
- [More…](https://github.com/sindresorhus/promise-fun)


## License

[MIT](https://github.com/DerTieran/p-auto/blob/master/license)
