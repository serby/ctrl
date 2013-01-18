module.exports = buildJS

var join = require('path').join
  , relative = require('path').relative
  , dirname = require('path').dirname
  // , uglify = require('uglify-js')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , scriptLoader = require('./script-loader')
  , moduleWrapper = require('./module-wrapper')

/*
 * Build the admin JS
 */
function buildJS(pliers, files, root, done) {

  var count = files.length

  pliers.logger.debug('Found ' + count + ' JS file(s)')

  function writeLoader() {
    pliers.logger.debug('Writing script loader to /build/boot.js')
    var js = files.map(function (file) {
      return relative(join(root, 'app'), file)
    })
    fs.writeFile(join(root, 'build', 'boot.js'), scriptLoader(js), function (err) {
      if (err) throw err
      done()
    })
  }

  function complete() {
    if (--count === 0) writeLoader()
  }

  pliers.logger.debug('Removing ' + join(root, 'build'))

  rimraf(join(root, 'build'), function (err) {
    if (err) pliers.logger.error(err)
    files.forEach(function (file) {
      var name = relative(join(root, 'app'), file)
        , dest = join(root, 'build', name)

      mkdirp(dirname(dest), function (err) {
        if (err) throw err
        pliers.logger.debug('Wrapping ' + name + ' and writing to /build/' + name)
        fs.createReadStream(file)
          .pipe(moduleWrapper(name))
          .pipe(fs.createWriteStream(dest))
          .on('close', function () {
            complete()
          })
      })
    })
  })

}