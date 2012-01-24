var
	fs = require('fs'),
	gm = require('gm'),
	path = require('path');

module.exports.createRoutes = function(app, properties, serviceLocator) {

	function createCacheForImage(hash, filename, cacheFilename, process, callback) {

		fs.stat(cacheFilename, function(error, stat) {
			if (!error && stat.isFile()) {
				callback(null, cacheFilename);
			} else {
				serviceLocator.logger.info('Creating thumbnail cache: %s', cacheFilename);
				var dataFilename = path.join(properties.dataPath, hash, filename);

				fs.mkdir(path.join(properties.cachePath, hash), '0755', function(error) {
					if (error && error.code !== 'EEXIST') {
						return callback(error, null);
					}
					process(dataFilename, cacheFilename, function(error) {
						return callback(error, cacheFilename);
					});
				});
			}
		});
	}

	function sendFile(res, filePath) {
		// How long to keep in cache
		var clientMaxAge = 604800000;
		res.setHeader('Expires', new Date(Date.now() + clientMaxAge).toUTCString());
		fs.createReadStream(filePath).pipe(res);
	}

	app.get('/image/:process/:path/:size/:filename', function(req, res, next) {
		var
			width,
			height,
			dimensions = req.params.size.match(/(\d+)x(\d+)/);

		if (dimensions) {
			width = dimensions[1];
			height = dimensions[2];
		} else {
			return next(new RangeError('Invalild size format'));
		}

		var processes = {
			resize: function (sourceFile, destinationFile, callback) {
				gm(sourceFile).colorspace('rgb')
				.in('-resize', +(width * 0.94) + 'x' + +(height * 0.94))
				.in('-background', 'white')
				.in('-gravity', 'center')
				.in('-extent', width + 'x' + height)
				.quality(60).write(destinationFile, function(error) {
					callback(error, destinationFile);
				});
			},
			crop: function (sourceFile, destinationFile, callback) {
				gm(sourceFile)
				.colorspace('rgb')
				.in('-gravity', 'center')
				.thumb(width, height, destinationFile, 60, function(error) {
					callback(error, destinationFile);
				});
			}
		};

		if (processes[req.params.process] === undefined) {
			return next(new Error('No such image process \'%s\' chose from %s', req.params.process, Object.keys(processes).join(',')));
		}

		var cacheFilename = path.join(properties.cachePath, req.params.path, req.params.size + '-' + req.params.process + '-' + req.params.filename);

		createCacheForImage(req.params.path, req.params.filename, cacheFilename, processes[req.params.process], function(error, cacheFilename) {
			if (error) {
				return next(error);
			}
			sendFile(res, cacheFilename);
		});
	});

};