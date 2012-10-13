var stylus = require('./stylus')
  , fs = require('fs')
  , url = require('url')
  , basename = require('path').basename
  , dirname = require('path').dirname
  , mkdirp = require('mkdirp')
  , join = require('path').join
  , debug = require('debug')('stylus:middleware');

/**
 * Import map.
 */

var imports = {};

function ccompile (str, path){
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .set('firebug', false)
    .set('linenos', false);
}

module.exports = function(path, options) {
  options = options || {};

  // Accept src/dest dir
  if ('string' === typeof options) {
    options = { src: options };
  }

  // Force compilation
  var force = options.force;

  // Source dir required
  var src = options.src;

  if (!src) {
    throw new Error('stylus.middleware() requires "src" directory');
  }

  // Default dest dir to source
  var dest = options.dest
    ? options.dest
    : src;


      var stylusPath = join(dest, path)
        , cssPath = join(src, path.replace('.styl', '.css'));

      // Ignore ENOENT to fall through as 404
      function error(err) {

      }

      // Force
      if (force) {
        return compile();
      }

      // Compile to cssPath
      function compile() {
        debug('read %s', cssPath);
        fs.readFile(stylusPath, 'utf8', function(err, str){
          if (err) {
            return error(err);
          }
          var style = options.compile(str, stylusPath);
          var paths = style.options._imports = [];
          delete imports[stylusPath];
          style.render(function(err, css){

            debug('render %s', stylusPath);

            imports[stylusPath] = paths;
            mkdirp(dirname(cssPath), '0700', function(err){
              if (err) {
                return error(err);
              }
              fs.writeFile(cssPath, css, 'utf8');
            });
          });
        });
      }

      // Re-compile on server restart, disregarding
      // mtimes since we need to map imports
      if (!imports[stylusPath]) {
        return compile();
      }

      // Compare mtimes
      fs.stat(stylusPath, function(err, stylusStats){
        if (err) {
          return error(err);
        }
        fs.stat(cssPath, function(err, cssStats){
          // CSS has not been compiled, compile it!
          if (err) {
            if ('ENOENT' === err.code) {
              debug('not found %s', cssPath);
              compile();
            }
          } else {
            // Source has changed, compile it
            if (stylusStats.mtime > cssStats.mtime) {
              debug('modified %s', cssPath);
              compile();
            // Already compiled, check imports
            } else {
              checkImports(stylusPath, function(changed){
                if (debug && changed.length) {
                  changed.forEach(function(path) {
                    debug('modified import %s', path);
                  });
                }
                if (changed.length) {
                  compile();
                }
              });
            }
          }
        });
      });

};

/**
 * Check `path`'s imports to see if they have been altered.
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

function checkImports(path, fn) {
  var nodes = imports[path];
  if (!nodes) {
    return fn();
  }
  if (!nodes.length) {
    return fn();
  }

  var pending = nodes.length
    , changed = [];

  nodes.forEach(function(imported){
    fs.stat(imported.path, function(err, stat){
      // error or newer mtime
      if (err || !imported.mtime || stat.mtime > imported.mtime) {
        changed.push(imported.path);
      }
      --pending || fn(changed);
    });
  });
}