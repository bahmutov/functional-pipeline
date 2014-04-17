if (typeof global !== 'object') {
  return;
}

if (typeof expect === 'undefined') {
  var expect = require('expect.js');
}

// running under node, try get debug fp function
describe('using fp-debug under node', function () {
  beforeEach(function () {
    global.fpDebug = true;
    delete require.cache[require.resolve('../fp')];
  });

  afterEach(function () {
    delete global.fpDebug;
  });

  it('grabs debug fp from node', function () {
    var fp = require('../fp');
    expect(fp).to.be.a(Function);
    expect(fp).to.be.ok();
  });
});
