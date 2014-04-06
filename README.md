# d3-helpers

> Little utility D3 functions

[![NPM][d3-helpers-icon] ][d3-helpers-url]

[![Build status][d3-helpers-ci-image] ][d3-helpers-ci-url]
[![Coverage Status][d3-helpers-coverage-image]][d3-helpers-coverage-url]
[![dependencies][d3-helpers-dependencies-image] ][d3-helpers-dependencies-url]
[![devdependencies][d3-helpers-devdependencies-image] ][d3-helpers-devdependencies-url]

Install and use under Node:

```
npm install d3-helpers --save
var d3h = require('d3-helpers');
```

Install and use in browser using bower:

```
bower install d3-helpers
<script src="bower_components/d3-helpers/index.js"></script>
// attaches as window.d3h object
```

## Example

D3 code before

```js
// x and y are scale functions
var line = d3.svg.line()
  .x(function (d) { return x(new Date(d.date)); })
  .y(function (d) { return y(+d.y); });
```

This is very common D3 callback code. Here is the same code with callbacks refactored
with *d3-helpers*

```js
var line = d3.svg.line()
  .x(d3h('date', d3h.newDate, x))
  .y(d3h('y', Number, y));
```

Notice several benefits:

1. The `.x` callback is easier to read from left to right:
grab property *date*, then call *d3h.newDate* function on it, then call *x* function.
No more inside out composition flow as in `x(new Date(d.date))`
2. Allowing only property names and functions to apply makes the author's intention clear.
`+d.y` is always ambiguous: did the author forget to add something or was this the
intention? Writing `d3h('y', Number, ...)` makes it explicit.
3. By eliminating writing each callback function, we eliminate potential sources of errors.
In addition, since every function passed as argument is external, they becoming testable.

## Api

**d3-helpers** is a [well-tested](test/helpers.spec.js) function
augmented by other tiny functions. First the *d3h* function itself

### d3h = d3h.d

Returns a function that can chain property access and function composition.

`d3h('propertyName', fnToApply, 'method name to call', 'anotherPropertyName', orAnotherFn, ...);`

```js
var foo = {
  getName: function() { return this.name; },
  name: 'foo'
};
function concatSelf(x) { return x + x; }
function add2(x) { return x + 2; }
var f = d3h('getName', concatSelf, 'length', add2);
f(foo) // returns 8

// f is the same as
function (obj) {
  return add2(concatSelf(obj.getName()).length);
}
```

Use on `d` argument:

```js
  .x(d3h('length', xScale));
  // d3h.d is an alias
  .(d3h.d('length', xScale));
```

When calling a method on the object, `this` is bound to the
object, and it is passed itself as first argument.

### d3h.i

Same chaining as `d3h.d` but operates on the second argument, usually the index

```js
.y(d3h.i(yScale))
// same as
.y(function (d, i) {
  return yScale(i);
});
```

If you want to return the index element, you need to execute the function to create the callback

```js
.y(d3h.i())
// same as
.y(function (d, i) {
  return i;
});
```

### d3h.noop

Same as `function () {}`

### d3h.undef

Same as `function () { return; }` if you need a function that
always returns *undefined*.

### d3h.pass = d3.datum

Same as `function (d) { return d; }`

You can pass a function as argument, then it works as a wrapped
function for any value passed next. For example to scale by function
*triple* we can replace

```
function triple(x) { return 3 * x; }
.attr('left', function (d) { return triple(d); })
// with
.attr('left', d3h.pass(triple));
```

### d3h.property

```js
function property(name) {
  return function (obj) {
    return obj[name];
  };
}
// if passed function(s) as additional arguments
function property(name, f, g, ...) {
  return function (obj) {
    return g(f(obj[name]));
  };
}
```

Logically, read this from left to right. First grab named property,
then apply function *f*, then apply to the result *g*, etc.

Useful to extract a property and convert type, for example for D3 selections

```js
.text(d3h.property('name'))
.width(d3h.property('age', Number))
.text(d3h.property('date', String))
```

or scale property from datum

```js
var x = d3.time.scale(), y = d3.scale.linear();
var line = d3.svg.line()
  .x(function (d) { return x(d.date); })
  .y(function (d) { return y(d.y); });
// same using d3-helpers
var line = d3.svg.line()
  .x(d3h.property('date', x))
  .y(d3h.property('y', y))
```

### d3h.yes / no

*d3h.yes* function always returns `true`,
*d3h.no* function always returns `false`.

### d3h.index

Same as `function (d, i) { return i; }`

### d3h.value

Same as

```js
function (val) {
  return function () {
    return val;
  };
}
```

Value could be anything: number, string, undefined, even another function.

### d3h.newDate

Same as `function (d) { return new Date(d); }` to get around
the `new` keyword requirement in JavaScript for Dates. Useful
for constructing Date instances inside *d3h.property*

```js
var x = d3.time.scale();
var line = d3.svg.line()
  .x(function (d) { return x(new Date(d.date)); })
// same using d3-helpers
var line = d3.svg.line()
  .x(d3h.property('date', d3h.newDate, x))
```

### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/d3-helpers/issues) on Github

## MIT License

Copyright (c) 2014 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[d3-helpers-icon]: https://nodei.co/npm/d3-helpers.png?downloads=true
[d3-helpers-url]: https://npmjs.org/package/d3-helpers
[d3-helpers-ci-image]: https://travis-ci.org/bahmutov/d3-helpers.png?branch=master
[d3-helpers-ci-url]: https://travis-ci.org/bahmutov/d3-helpers
[d3-helpers-coverage-image]: https://coveralls.io/repos/bahmutov/d3-helpers/badge.png
[d3-helpers-coverage-url]: https://coveralls.io/r/bahmutov/d3-helpers
[d3-helpers-dependencies-image]: https://david-dm.org/bahmutov/d3-helpers.png
[d3-helpers-dependencies-url]: https://david-dm.org/bahmutov/d3-helpers
[d3-helpers-devdependencies-image]: https://david-dm.org/bahmutov/d3-helpers/dev-status.png
[d3-helpers-devdependencies-url]: https://david-dm.org/bahmutov/d3-helpers#info=devDependencies
