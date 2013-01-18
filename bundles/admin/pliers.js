var join = require('path').join
  , compileStylus = require('../../lib/pliers-helpers/compile-stylus')

module.exports = function(pliers) {

  pliers.filesets('js', ['*.js', 'test/*.js'])

  pliers('test', function(done) {
    pliers.exec('./node_modules/.bin/mocha -r should -R spec', done)
  })

  pliers('lint', { description: 'Run jshint all on project JavaScript' }, function(done) {
    pliers.exec('jshint lib test', done)
  })

  pliers('qa', 'test', 'lint')

  pliers('watch', function() {
    pliers.watch(
      pliers.fileset.js,
      pliers.tasks.lint)
  })

  pliers.filesets('stylus', join(__dirname, 'public', 'css', '**/*.styl'))

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