var join = require('path').join
  , buildJS = require('../../lib/pliers-helpers/build-js')
  , compileStylus = require('../../lib/pliers-helpers/compile-stylus')

module.exports = function(pliers) {

  pliers.filesets('js', ['*.js', 'test/*.js'])

  pliers('test', function(done) {
    pliers.exec('mocha -r should -R spec', done)
  })

  pliers('lint', { description: 'Run jshint all on project JavaScript' },
    function(done) {

    pliers.exec('jshint lib test', done)
  })

  pliers('qa', 'test', 'lint')

  pliers('watch', function() {
    pliers.watch(
      pliers.fileset.js,
      pliers.tasks.lint)
  })


  pliers.filesets('globalBrowserJs', join(__dirname, 'public/js/app/lib',
    '**/*.js'))

  pliers('buildGlobalBrowserJs', function () {
    var root = join(__dirname, 'public', 'js')
    pliers.exec('browserify ' + root + '/app/lib/admin.js -o ' + root +
      '/build/global.js')
  })

  pliers('watchBrowserJs', function(done) {
    pliers.watch(pliers.filesets.globalBrowserJs, function() {
      pliers.run('buildGlobalBrowserJs')
    })
    done()
  })

  pliers.filesets('stylus', join(__dirname, 'public/css', '**/*.styl'))

  pliers('buildCss', function (done) {
    var files = join(__dirname, 'public', 'css', 'index.styl')
    compileStylus(pliers, files, done)
  })

  pliers('watchCss', function(done) {
    pliers.watch(pliers.filesets.stylus, function() {
      pliers.run('buildCss')
    })
    done()
  })

  //pliers.default('test')
}