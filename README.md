# functional-pipeline

> Quickly chain method calls, property access and functions in natural left to right expression.

[![NPM][functional-pipeline-icon] ][functional-pipeline-url]

[![Build status][functional-pipeline-ci-image] ][functional-pipeline-ci-url]
[![Coverage Status][functional-pipeline-coverage-image]][functional-pipeline-coverage-url]
[![dependencies][functional-pipeline-dependencies-image] ][functional-pipeline-dependencies-url]
[![devdependencies][functional-pipeline-devdependencies-image] ][functional-pipeline-devdependencies-url]

Install and use under Node:

```
npm install functional-pipeline --save
var fp = require('functional-pipeline');
```

Install and use in browser using bower:

```
bower install functional-pipeline
<script src="bower_components/functional-pipeline/index.js"></script>
// attaches as window.fp object
```

## Example

Assuming this common code:

```js
function triple(x) { return 3 * x; }
function add2(x) { return x + 2; }
var data = {
  age: 10,
  getAge: function () { return this.age; }
};
```

You can express in single line

```js
var pipeline = fp('getAge', triple, add2);
```

what usually takes several compositions that are read from inside out

```js
function pipeline(obj) {
  return add2(triple(obj.getAge()));
}
```

## Why?

Clear code is good code. Functional pipeline makes it easy:

* Reading chained pipeline left to right is natural
* Having no branches (they should be encapsulated inside functions) lowers complexity
* Compose multiple small functions makes code modular and easy to test

I especially recommend using functional pipelines for callbacks,
replacing code with prebuilt and testable pipelines.

Example: lets sort objects in the collection by date nested 2 levels deep. This is
typical of the code arriving from the back end for example. Below
each operation I am showing its order in the callback function. The actual
argument name *item* does not matter.

```js
items = _.sortBy(items, function(item) {
  return new Date(item.latest_event.datetime);
  ------ --------      ------------ --------
     4      3                1         2
});
```

1. Grab `latest_event` property
2. Grab 'datetime' property
3. Create new *Date* object from result of the previous step
4. Return the created date.

Reading the steps starting in the middle left to right, then switching
to right to left back at the start of the line is unnatural to me. Here is the same
sequence using *functional-pipeline*. The return operation is implicit.

```js
function newDate(a) { return new Date(a); }
items = _.sortBy(items, fp('latest_event', 'datetime', newDate));
                           --------------  ----------  -------
                                  1             2         3
```

We had to create a utility function *newDate* to get around JavaScript's `new` keyword.
You could use my [d3-helpers](https://github.com/bahmutov/d3-helpers) library that
provides both functional pipeline and a few small utility functions like `newDate`.

### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/functional-pipeline/issues) on Github

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

[functional-pipeline-icon]: https://nodei.co/npm/functional-pipeline.png?downloads=true
[functional-pipeline-url]: https://npmjs.org/package/functional-pipeline
[functional-pipeline-ci-image]: https://travis-ci.org/bahmutov/functional-pipeline.png?branch=master
[functional-pipeline-ci-url]: https://travis-ci.org/bahmutov/functional-pipeline
[functional-pipeline-coverage-image]: https://coveralls.io/repos/bahmutov/functional-pipeline/badge.png
[functional-pipeline-coverage-url]: https://coveralls.io/r/bahmutov/functional-pipeline
[functional-pipeline-dependencies-image]: https://david-dm.org/bahmutov/functional-pipeline.png
[functional-pipeline-dependencies-url]: https://david-dm.org/bahmutov/functional-pipeline
[functional-pipeline-devdependencies-image]: https://david-dm.org/bahmutov/functional-pipeline/dev-status.png
[functional-pipeline-devdependencies-url]: https://david-dm.org/bahmutov/functional-pipeline#info=devDependencies
