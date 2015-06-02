if (typeof fp === 'undefined') {
  var fp = require('..');
}
if (typeof expect === 'undefined') {
  var expect = require('expect.js');
}

describe('splitting dot paths in a list', function () {
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

  var j = JSON.stringify;

  it('passes the array unchanged if there are no dots', function () {
    var input = ['a', 'b', 'c'];
    var result = splitDots(input);
    expect(j(result)).to.equal(j(input));
  });

  it('passes the empty array unchanged', function () {
    var input = [];
    var result = splitDots(input);
    expect(j(result)).to.equal(j(input));
  });

  it('passes the empty strings unchanged', function () {
    var input = ['a', '', 'b'];
    var result = splitDots(input);
    expect(j(result)).to.equal(j(input));
  });

  it('splits dots', function () {
    var input = ['a.b'];
    var result = splitDots(input);
    expect(j(result)).to.equal(j(['a', 'b']));
  });

  it('splits multiple arguments', function () {
    var input = ['a.b', 'c.d'];
    var result = splitDots(input);
    expect(j(result)).to.equal(j(['a', 'b', 'c', 'd']));
  });

  it('splits multiple dots', function () {
    var input = ['a.b.c.d'];
    var result = splitDots(input);
    expect(j(result)).to.equal(j(['a', 'b', 'c', 'd']));
  });

  it('passes non-strings', function () {
    var input = ['a.b.c.d', []];
    var result = splitDots(input);
    expect(j(result)).to.equal(j(['a', 'b', 'c', 'd', []]));
  });

  it('returns numbers too', function () {
    var input = ['a.0.1.d'];
    var result = splitDots(input);
    expect(j(result)).to.equal(j(['a', '0', '1', 'd']));
  });
});

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

    describe('nested property access', function () {
      var obj = {
        a: {
          b: {
            c: 'foo'
          }
        }
      };

      it('extracts nested properties in turns', function () {
        expect(fp('a', 'b', 'c')(obj)).to.equal('foo');
      });

      it('extracts nested properties using single path', function () {
        expect(fp('a.b.c')(obj)).to.equal('foo');
      });

      it('extracts single level', function () {
        expect(fp('a.b')(obj)).to.equal(obj.a.b);
      });

      it('extracts from arrays', function () {
        var list = [obj];
        expect(fp('0.a.b')(list)).to.equal(obj.a.b);
      });
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

describe('version information', function () {
  it('has version object', function () {
    expect(fp.version).to.be.an('object');
  });

  it('has meta properties', function () {
    expect(fp.version.name).to.be.a('string');
    expect(fp.version.description).to.be.a('string');
  });

  it('has semver', function () {
    expect(fp.version.version).not.to.contain('%%');
    var semver = /^\d+\.\d+\.\d+$/;
    expect(semver.test(fp.version.version)).to.be.ok();
  });
});
