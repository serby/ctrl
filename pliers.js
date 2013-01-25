module.exports = function(pliers) {

  var appProcess

  pliers.load('./bundles/admin')

  pliers.filesets('js', ['*.js', 'lib/**/*.js', 'test/*.js', 'bundles/**/*.js'])
  pliers.filesets('appJs', ['*.js', 'lib/**/*.js', 'bundles/**/*.js'],
    ['bundles/**/public/**/*.js', '**/pliers.js'])

  pliers('test', function(done) {
    pliers.exec('./node_modules/.bin/mocha -r should -R spec', done)
  })

  pliers('lint', { description: 'Run jshint all on project JavaScript' }, function(done) {
    pliers.exec('jshint lib test', done)
  })

  pliers('qa', 'test', 'lint')

  pliers('qaWatch', function(done) {
    pliers.logger.info('Rerun QA on code change')
    pliers.watch(
      pliers.filesets.js, function() {
        pliers.run('qa')
      })
    done()
  })

  pliers('start', function() {
    if (appProcess) {
      appProcess.kill()
      appProcess = null
      pliers.logger.info('Restarting app')
    } else {
      pliers.logger.info('Starting node app')
    }
    appProcess = pliers.exec('node app.js')
  })

  pliers('mon', function() {
    console.log(1, pliers.filesets.appJs)
    pliers.logger.info('Restart app on code change')

    pliers.watch(pliers.filesets.appJs, function(fsWatcher, filename) {
      pliers.logger.info('Change in ' + filename)
      pliers.run('start')
    })

    pliers.logger.info('Recompile CSS on change')
    pliers.run('watchCss')

    pliers.logger.info('Starting app')
    pliers.run('start')
  })

  //pliers.default('test')
}