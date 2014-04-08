if (typeof fp === 'undefined') {
  var fp = require('..');
}
if (typeof expect === 'undefined') {
  var expect = require('expect.js');
}

describe('functional-pipeline', function () {
  function triple(x) { return 3 * x; }
  function add2(x) { return x + 2; }

  describe('fp function itself', function () {
    it('is a function', function () {
      expect(fp).not.to.be(undefined);
      expect(fp).to.be.a('function');
      expect(fp.name).to.be('fp');
    });

    it('function composition', function () {
      expect(fp(triple, add2)(5)).to.equal(17);
    });

    it('can extract property and apply functions', function () {
      var foo = {
        age: '11'
      };
      expect(fp('age', triple, add2)(foo)).to.equal(35);
    });

    it('can apply function and extract property', function () {
      var foo = {
        name: 'foo'
      };
      function concatSelf(x) { return x + x; }
      expect(fp('name', concatSelf, 'length', add2)(foo)).to.equal(8);

      function explicit(obj) {
        return add2(concatSelf(obj.name).length);
      }
      expect(explicit(foo)).to.equal(8);
    });

    it('can call functions', function () {
      var data = {
        name: function () {
          return 'foo';
        }
      };
      expect(fp('name')(data)).to.equal('foo');
    });

    it('method, get property, execute function', function () {
      var data = {
        self: function () {
          return this;
        },
        age: 10
      };
      expect(fp('self', 'age', add2)(data)).to.equal(12);
    });
  });

  describe('handing errors', function () {
    it('handles non-existent property or method', function () {
      var obj = {};
      expect(fp('foo')(obj)).to.be(undefined);
    });

    it('tries to call non-existent function', function () {
      var obj = {};
      var pipeline = fp(this.foo); // non existing function
      expect(pipeline.bind(null, obj)).throwError();
    });

    it('cannot call object on object', function () {
      expect(function () {
        fp(triple, add2, {})(5);
      }).to.throwException(function (e) {
        expect(e.message).to.contain('Cannot apply');
      });
    });
  });
});
