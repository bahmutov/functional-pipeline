if (typeof fp === 'undefined') {
  var fp = require('../fp-debug');
}
if (typeof expect === 'undefined') {
  var expect = require('expect.js');
}

describe('functional-pipeline debug', function () {
  function triple(x) { return 3 * x; }
  function add2(x) { return x + 2; }

  describe('fpd function itself', function () {
    it('is a function', function () {
      expect(fp).not.to.be(undefined);
      expect(fp).to.be.a('function');
      expect(fp.name).to.be('fp');
    });

    it('has .debug flag', function () {
      expect(fp.debug).to.be(true);
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
      var pipeline = fp('foo').bind(null, obj);
      expect(pipeline).to.throwException(function (e) {
        expect(e.message).to.contain('foo');
      });
    });

    it('cannot create chain from non-existent function', function () {
      expect(function () {
        fp(this.foo); // non existing function
      }).to.throwException(function (e) {
        expect(e.message).to.contain('0:');
      });

      expect(function () {
        fp(triple, this.foo); // non existing function
      }).to.throwException(function (e) {
        expect(e.message).to.contain('1:');
      });

      expect(function () {
        fp(triple, add2, this.foo); // non existing function
      }).to.throwException(function (e) {
        expect(e.message).to.contain('2:');
      });
    });

    it('cannot create chain from invalid arguments', function () {
      expect(function () {
        fp(triple, add2, 44);
      }).to.throwException(function (e) {
        expect(e.message).to.contain('2: number');
      });

      expect(function () {
        fp(triple, add2, {});
      }).to.throwException(function (e) {
        expect(e.message).to.contain('2: object');
      });
    });

    it('tries to call non-existent function or property', function () {
      var obj = {
        bar: {
          baz: 'baz'
        }
      };
      expect(function () {
        var pipeline = fp('bar', 'foo');
        expect(pipeline).to.be.a('function');
        pipeline(obj);
      }).to.throwException(function (e) {
        expect(e.message).to.contain('foo');
        expect(e.message).to.contain('pipeline');
        // describes original object
        expect(e.message).to.contain('bar');
      });
    });

    it('throws an exception on construction', function () {
      expect(function () {
        fp('foo', this.bar);
      }).to.throwError();
    });
  });
});
