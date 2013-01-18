module.exports = compileStylus

var stylus = require('stylus')
  , nib = require('nib')
  , fs = require('fs')
  , versionator = require('versionator').createBasic('v' + require('../../properties')().version)
  , relative = require('path').relative

function compileStylus(pliers, stylesheets, done) {

  if (!Array.isArray(stylesheets)) stylesheets = [ stylesheets ]

  var count = stylesheets.length

  pliers.logger.debug('Found ' + count + ' stylesheet(s)')

  function complete(err) {
    if (err && err.name === 'ParseError') {
      pliers.logger.error(err.message)
    } else if (err) {
      throw err
    }
    if (--count === 0) done()
  }
  stylesheets.forEach(function (file) {
    pliers.logger.debug('Compiling ' + relative(process.cwd(), file))
    compileFile(file, complete)
  })

}

function compile(str, path) {
  return stylus(str)
    .use(nib())
    .set('filename', path)
    // .set('warn', true)
    .set('compress', true)
    .define('versionPath', function(urlPath) {
      return new stylus.nodes.Literal('url(' + versionator.versionPath(urlPath) + ')')
    })
}

function compileFile(file, cb) {
  fs.readFile(file, 'utf8', function(err, str) {
    if (err) throw err
    var style = compile(str, file)
    style.render(function (err, css) {
      if (err) return cb(err)
      writeFile(file.replace('.styl', '.css'), css, function(error) {
        if (error) return cb(error)
        cb(null)
      })
    })
  })
}

function writeFile(file, css, callback) {
  fs.writeFile(file, css, function (err) {
    if (err) return callback(err)
    callback(undefined, file)
  })
}