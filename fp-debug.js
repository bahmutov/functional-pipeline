(function () {

  function assemble() {

    function isStringOrFunction(f) {
      return typeof f === 'string' ||
        typeof f === 'function';
    }

    function humanizeArgument(f, k) {
      if (typeof f === 'string') {
        return k + ': string ' + f;
      }
      if (typeof f === 'function') {
        return k + ': function ' + f.name;
      }
      if (typeof f === 'undefined') {
        return k + ': undefined argument';
      }
      return k + ': ' + (typeof f) + ' argument';
    }

    // Creates an optimistic chain, no checks before calling a function
    // or accessing a property, or calling a method
    function fp() {
      var args = Array.prototype.slice.call(arguments, 0);
      if (args.length) {
        if (!args.every(isStringOrFunction)) {
          var signature = args.map(humanizeArgument).join('\n\t');
          throw new Error('Invalid arguments to functional pipeline - not a string or function\n\t' +
            signature);
        }

        var fns = args;
        return function (d) {
          var originalObject = d;
          fns.forEach(function (fn) {
            if (typeof fn === 'string') {
              if (typeof d[fn] === 'function') {
                d = d[fn].call(d, d);
              } else if (typeof d[fn] !== 'undefined') {
                d = d[fn];
              } else {
                var signature = args.map(humanizeArgument).join('\n\t');
                throw new Error('Cannot use property ' + fn + ' from object ' +
                  JSON.stringify(d, null, 2) + '\npipeline\n\t' + signature +
                  '\noriginal object\n' + JSON.stringify(originalObject, null, 2));
              }
            } else if (typeof fn === 'function') {
              d = fn(d);
            } else {
              throw new Error('Cannot apply ' + JSON.stringify(fn, null, 2) +
                ' to value ' + d + ' not a property name or a function');
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

  var fp = assemble();
  fp.debug = true;
  register(fp, 'fp');

}());
