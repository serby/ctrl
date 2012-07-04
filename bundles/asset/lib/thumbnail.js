var fs = require('fs')
  , path = require('path')
  , gm = require('gm')
  , mkdirp = require('mkdirp');

function thumbnail(properties) {

  return function thumb(image, cb) {

    var raw = properties.dataPath + '/' + image.path + '/' + image.basename
      , cached = properties.cachePath + '/' + image.path + '/' + image.basename

    path.exists(cached, function (exists) {
      if (!exists) {
        mkdirp(path.dirname(cached), function (err) {
          if (err) {
            cb(err);
          } else {
            gm(raw)
              .resize('100', '100')
              .write(cached, function (err) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, fs.createReadStream(cached));
                }
              });
          }
        });
      } else {
        cb(null, fs.createReadStream(cached));
      }

    });

  }
}

module.exports = thumbnail;