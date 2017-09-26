'use strict';

const test = require('ava');
const delay = require('delay');
const m = require('./');

test('resolves all tasks', async t => {
  t.deepEqual(await m({
    foo: 1,
    bar: () => delay(100).then(() => 2),
    faz: ['foo', 'bar', r => r.foo + r.bar]
  }), {
    foo: 1,
    bar: 2,
    faz: 3
  });
});

test('throws if any of the tasks promises reject', async t => {
  await t.throws(m({
    foo: 1,
    bar: () => Promise.reject(new Error('bar')),
    faz: ['foo', 'bar', r => r.foo + r.bar]
  }), 'bar');
});

test('handles empty tasks', async t => {
  t.deepEqual(await m({}), {});
});

test('handles falsy dependencies', async t => {
  t.deepEqual(await m({
    foo: null,
    bar: undefined,
    faz: ['foo', 'bar', () => 'faz']
  }), {
    foo: null,
    bar: undefined,
    faz: 'faz'
  });
});

test('just resolves with defined dependencies', async t => {
  t.deepEqual(await m({
    foo: 1,
    bar: () => delay(100).then(() => 2),
    faz: ['bar', r => r.foo]
  }), {
    foo: 1,
    bar: 2,
    faz: undefined
  });
});

test('throws on non existing dependencies', async t => {
  await t.throws(m({
    bar: ['foo', r => r.foo]
  }), 'Non existing dependency foo in bar');
});
