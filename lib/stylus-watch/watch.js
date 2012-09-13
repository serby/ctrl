var fs = require('fs')
  , stylus = require('stylus')
  , join = require('path').join
  , events = require('events')
  ;

module.exports = function (path, compile) {

  var defaultCompile = compile || function (str, path){
      return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .set('firebug', false)
        .set('linenos', false);
    };

  function compileFile(inputFile, outputFile) {
    fs.readFile(inputFile, 'utf8', function(err, str){
      if (err) {
        throw err;
      }

      var style = defaultCompile(str, inputFile)
        , paths = style.options._imports = []
        ;
      style.render(function onRender(err, css) {

        if (err) {
          throw err;
        }

        writeFile(outputFile, css);
        watchImports(paths);
      });
    });
  }

  function processFile (file) {

    // Ensure .styl file exists
    fs.lstat(file, function(err, stat) {

      if (err) {
        throw err;
      }

      var cssPath = file.replace('.styl', '.css')
       ;

      fs.lstat(cssPath, function(err, cssStat) {

        if (err) {
          if (err.code === 'ENOENT') {
            return compileFile(file, cssPath);
          } else {
            throw err;
          }
        }

        // If is a file and the .css file is older than .styl file compile
        if (stat.isFile() && (cssStat.ctime < stat.mtime)) {
          return compileFile(file, cssPath);
        }
      });
    });
  }

  function writeFile (file, css) {
    fs.writeFile(file, css, function(err){
      if (err) {
        throw err;
      }
      console.log('  \033[90mcompiled\033[0m %s', path);
    });
  }

  function watchImports(imports) {
    imports.forEach(function(importFilename) {
      fs.watch(importFilename, function (event, filename) {
        processFile(path);
      });
    });
  }

  // Only process .styl
  if (/\.styl$/.test(path)) {

    // Always process and compile the file on startup if needed
    processFile(path);

    // Then watch for changes
    fs.watch(path, function (event, filename) {
      processFile(path);
    });

  } else {
    throw new Error(path + ' is not a .styl file');
  }
};