/**
 functional-pipeline@0.4.1
 Quickly chain method calls, property access and functions in natural left to right expression
 Gleb Bahmutov <gleb.bahmutov@gmail.com>
 https://github.com/bahmutov/functional-pipeline
*/

(function fpInit() {

  // ['a.b.c', 'd'] -> ['a', 'b', 'c', 'd']
  function splitDots(list) {
    var result = [];
    list.forEach(function (x) {
      if (typeof x === 'string') {
        x.split('.').forEach(function (part) {
          result.push(part);
        });
      } else {
        result.push(x);
      }
    });
    return result;
  }

  function assemble() {

    // Creates an optimistic chain, no checks before calling a function
    // or accessing a property, or calling a method
    function fp() {
      var args = Array.prototype.slice.call(arguments, 0);
      if (args.length) {
        var fns = splitDots(args);
        return function applyPipe(d) {
          fns.forEach(function (fn) {
            if (typeof fn === 'string') {
              if (typeof d[fn] === 'function') {
                d = d[fn].call(d, d);
              } else {
                d = d[fn];
              }
            } else if (typeof fn === 'function') {
              d = fn(d);
            } else {
              throw new Error('Cannot apply ' + JSON.stringify(fn, null, 2) +
                ' to value ' + d + ' not a property name or function');
            }
          });
          return d;
        };
      }
    }

    return fp;
  }

  function register(value, name) {
    if (typeof window === 'object') {
      /* global window */
      window[name] = value;
    } else if (typeof module === 'object') {
      module.exports = value;
    } else {
      throw new Error('Do not know how to register ' + name);
    }
  }

  if (typeof global === 'object' && global.fpDebug) {
    module.exports = require('./fp-debug');
  } else {
    var fp = assemble();
    fp.version = {
      name: 'functional-pipeline',
      version: '0.4.1',
      author: 'Gleb Bahmutov <gleb.bahmutov@gmail.com>',
      description: 'Quickly chain method calls, property access and functions in natural left to right expression',
      homepage: 'https://github.com/bahmutov/functional-pipeline'
    };
    register(fp, 'fp');
  }

}());
