if (typeof expect === 'undefined') {
  var expect = require('expect.js');
}

describe('utils tests', function () {
  it('catches error', function () {
    function fn() {
      throw new Error('fn throws error');
    }
    expect(fn).throwError();
  });

  it('catches error when called with argument', function () {
    function fn(a) {
      if (a === 1) {
        throw new Error('fn throws error ' + a);
      }
    }
    expect(fn.bind(null, 1)).throwError();
    expect(fn.bind(null, 2)).not.throwError();
  });
});
