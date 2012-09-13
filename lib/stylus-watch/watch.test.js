  var watch = require('./watch')
  ;

describe('watch', function() {

  before(function() {
   fs.mkdirSync('./tmp');
  });

  after(function() {
    fs.unlinkSync('./tmp/main.styl');
    fs.unlinkSync('./tmp/test.styl');
    fs.unlinkSync('./tmp/test.css');
    fs.rmdirSync('./tmp');
  });

  it('should watch for changed files', function(done) {

    fs.writeFileSync('./tmp/main.styl', 'a\n\tpadding 0px');
    fs.writeFileSync('./tmp/test.styl', 'body\n\tborder 0px\n@import "./main"');

    watch('./tmp/test.styl').on('compiled', function(data) {
      done();
    });

  });

});