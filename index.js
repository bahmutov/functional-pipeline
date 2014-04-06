(function () {

  function assemble() {

    function chain() {
      var args = Array.prototype.slice.call(arguments, 0);
      if (args.length) {
        var fns = args;
        return function (d) {
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

    return chain;
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
  register(fp, 'fp');

}());
