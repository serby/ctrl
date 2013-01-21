var watch = require('./watch')
  , fs = require('fs')
  , join = require('path').join
  ;

describe('stylusWatch', function () {
  var tmpPath = __dirname + '/tmp'
    , paths =
      { testStyl: join(tmpPath, 'test.styl')
      , testCss: join(tmpPath, 'test.css')
      , mainStyl: join(tmpPath, 'main.styl')
      }
    ;

  before(function () {
    try {
      fs.mkdirSync(tmpPath);
    } catch (e) {}
  });

  afterEach(function () {
    try {
      Object.keys(paths).forEach(function (key) {
        fs.unlinkSync(paths[key]);
      });
    } catch (e) {}

  });

  after(function () {
    fs.rmdirSync(tmpPath);
  });

  function createStyl() {
    fs.writeFileSync(paths.mainStyl, 'a\n\tpadding 0px');
    fs.writeFileSync(paths.testStyl, 'body\n\tborder 0px\n@import "./main"');
  }

  it('should compile and write file on start', function (done) {
    createStyl();
    var w = watch(paths.testStyl).on('write', function (cssFile) {
      cssFile.should.eql(paths.testCss);
      w.unwatch();
      done();
    });
  });

  it('should compile and write file on change', function (done) {
    createStyl();
    var i = 0
      , w = watch(paths.testStyl).on('write', function (cssFile) {
      if (i === 0) {
        i++;
        setTimeout(function () {
          fs.writeFileSync(paths.testStyl, 'body\n\tborder 1px\n@import "./main"');
        }, 1000);
      } else {
        cssFile.should.eql(paths.testCss);
        w.unwatch();
        done();
      }

    });

  });


  it('should compile when a import changes', function (done) {
    createStyl();
    var i = 0
      , w = watch(paths.testStyl).on('write', function (cssFile) {
      if (i === 0) {
        i++;
        setTimeout(function () {
          fs.writeFileSync(paths.mainStyl, 'a\n\tpadding 2px');
        }, 1000);
      } else {
        cssFile.should.eql(paths.testCss);
        w.unwatch();
        done();
      }

    });

  });

});