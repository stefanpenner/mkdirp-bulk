var expect = require('chai').expect;
var unique = require('./lib/unique');
var mkdirBulk = require('./');
var fs = require('fs');
var rimraf = require('rimraf');

describe('unique', function() {
  it('works', function() {
    expect(unique([])).to.eql([]);
    expect(unique(['foo', 'foo'])).to.eql(['foo']);
    expect(unique(['a', 'b', 'a', 'a', 'b', 'c'])).to.eql(['a','b','c']);
  });
});

describe('async', function() {
  it('throws', function() {
    expect(mkdirBulk).to.throw(TypeError, 'only sync is currrently implemented');
  });
});

var fs = require('fs');

describe('sync', function() {
  var cwd = process.cwd();

  beforeEach(function() {
    rimraf.sync(__dirname + '/tests/fixtures');
    fs.mkdirSync(__dirname + '/tests/fixtures');
    process.chdir('tests/fixtures');
  });

  afterEach(function() {
    rimraf.sync(__dirname + '/tests/fixtures');
    process.chdir(cwd);
  });

  it('does not throw', function() {
    expect(function() {
      mkdirBulk.sync([]);
    }).to.not.throw(TypeError, 'only sync is currrently implemented');
  });

  it("works", function() {
    var count = mkdirBulk.sync(['foo/a', 'bar/a', 'baz/apple/orange/a']);

    expect(count).to.be.eql(5);

    expect(fs.existsSync('red'), 'expected: `red` to NOT exist').to.be.false;
    expect(fs.existsSync('foo'), 'expected: `foo` dir to exist').to.be.true;
    expect(fs.existsSync('bar'), 'expected: `bar` dir to exist').to.be.true;
    expect(fs.existsSync('baz/apple/orange'), 'expected: `baz/apple/orange` dir to exist').to.be.true;
  });

  it("ignores the root", function() {
    expect(mkdirBulk.sync([
      'foo.js'
    ])).to.be.eql(0);
  });

  it("works with absolute", function() {
    var full = __dirname + '/tests/fixtures/bar/foo.js';
    expect(mkdirBulk.sync([full])).to.be.eql(full.split('/').length - 2);
  });

  it("minimizes mkdirs", function() {
    expect(mkdirBulk.sync([
      'foo/a',
      'foo/bar/a',
      'foo/bar/baz/a'
    ])).to.be.eql(3);

    expect(mkdirBulk.sync([
      'foo/a',
      'foo/bar/a',
      'foo/bar/orange/a',
      'foo/bar/baz/a',
      'bar/baz/a'
    ])).to.be.eql(6);
  });

});
