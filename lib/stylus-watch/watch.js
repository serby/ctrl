var fs = require('fs')
  , stylus = require('stylus')
  , events = require('events')
  , _ = require('lodash')

module.exports = function (path, options) {

  var self = new events.EventEmitter()
    , defaults =
      { compile: function (str, path){
          return stylus(str,
            { filename: path
            //, paths: []
            , compress: true
            , firebug: false
            , linenos: true
            })
        }
      }
    , watches = {}
    , processing = false
    , cssPath = path.replace('.styl', '.css')

  options = _.extend({}, defaults , options)

  function compileFile(inputFile, outputFile) {
    self.emit('compile', inputFile, outputFile)
    fs.readFile(inputFile, 'utf8', function (err, str){
      if (err) {
        throw err
      }

      var style = options.compile(str, inputFile)
        , paths = style.options._imports = []

      style.render(function onRender(err, css) {

        if (err) {
          if (err.name === 'ParseError') {
            //TODO: This should go to the logger or be an event maybe?
            console.error('Compiling ' + inputFile + ' failed')
            console.log(err.message)
          } else {
            throw err
          }
        }

        writeFile(outputFile, css, function (error) {
          if (error) {
            throw error
          }
          processing = false
          watchImports(paths)
        })
      })
    })
  }

  function processFile (file, compile) {
    if (processing) {
      return false
    }
    processing = true
    self.emit('process', path)

    // Ensure .styl file exists
    fs.lstat(file, function (err, stat) {

      if (err) {
        throw err
      }

      fs.lstat(cssPath, function (err, cssStat) {

        if (err) {
          if (err.code === 'ENOENT') {
            return compileFile(file, cssPath)
          } else {
            throw err
          }
        }
        // If is a file and the .css file is older than .styl file compile
        if (compile || (stat.isFile() && (cssStat.mtime <= stat.mtime))) {
          return compileFile(path, cssPath)
        } else {
          processing = false
        }
      })
    })
  }

  function writeFile (file, css, callback) {
    fs.writeFile(file, css, function (err){
      if (err) {
        return callback(err)
      }
      self.emit('write', file)
      callback(undefined, file)
    })
  }

  function watch(file) {
    if (watches[file]) {
      return false
    }

    watches[file] = true
    fs.watch(file, function (event) {
      if (event !== 'rename') {
        processFile(file)
      }
    })
  }

  function watchImports(imports) {

    imports.forEach(function (importFilename) {
      watch(importFilename.path)
    })
  }

  // Only process .styl
  if (/\.styl$/.test(path)) {

    // Always process and compile the file on startup if needed
    processFile(path, true)

    // Then watch for changes
    watch(path)

  } else {
    throw new Error(path + ' is not a .styl file')
  }

  self.unwatch = function () {
    Object.keys(watches).forEach(function (filename) {
      fs.unwatchFile(filename)
    })
    watches = {}
  }

  return self
}