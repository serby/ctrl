var
	_ = require('underscore'),
	express = require('express'),
	fs = require('fs'),
	stylus = require('stylus'),
	cluster = require('cluster'),
	versionator = require('versionator'),
	MongoStore = require('connect-mongodb'),
	httpErrorHandler = require('./httpErrorHandler'),
	sessionStore,
	staticGzip = function(path, options) {

		var defaultOptions = {
			maxAge: 1728000000,
			clientMaxAge: 1728000000
		};

		_.extend(defaultOptions, options);

		return require('gzippo').staticGzip(path, defaultOptions);
	};

module.exports.createApplication = function(properties, serviceLocator, databaseAdaptor) {

	var
		app = express.createServer(),
		basic = versionator.createBasic('v' + properties.version);

	// First the environment specific configuration

	// Setup verbose error reporting on development
	app.configure('development', function() {
		app.error(httpErrorHandler.errorHandler(serviceLocator, properties.pageTitle));
	});

	app.configure('testing', function() {
		app.error(httpErrorHandler.errorHandler(serviceLocator, properties.pageTitle));
	});

	app.configure('production', 'errors', 'staging', function() {
		//var logStream  = fs.createWriteStream(properties.logPath + '/http.log', { flags: 'a', encoding: null, mode: '0666' });
		//console.info('Writing http logs to: %s', properties.logPath + '/http.log');
		app
			.error(httpErrorHandler.errorHandler(serviceLocator, properties.pageTitle));
			//.use(express.logger({ stream : logStream }));
	});

	// Then the more general config
	app.configure(function() {

		var basic = versionator.createBasic(properties.version);

		app
			.helpers({
				versionPath: basic.versionPath
			})
			.use(basic.middleware)
			.use(stylus.middleware({
				src: __dirname + '/../public/',
				compile: stylusCompile }))
			//.use(express.favicon(__dirname + '/public/images/structure/favicon.ico'))
			.use(staticGzip(__dirname + '/../public'))
			.use(staticGzip(properties.dataPath, { prefix: '/binary' }));

		// Add any public folders from the bundles
		serviceLocator.bundled.forEach('publicRoute', function(publicRoute, bundle) {

			serviceLocator.logger.verbose('Adding public folder from: ' + bundle.name +
				' path: ' + bundle.path + '/public - route: /' + publicRoute);

			app
				.use(staticGzip(bundle.path + '/public', { prefix: publicRoute }));
		});

		app
			.set('view engine', 'jade')
			.use(express.bodyParser())
			.use(express.cookieParser())
			.use(express.methodOverride())
			.use(express.session({
				secret: 'your secret here',
				store: new MongoStore({ db: databaseAdaptor.db })
			}));

		// Middleware
		serviceLocator.bundled.forEach('middleware', function(middleware, bundle) {

			app
				.use(middleware(serviceLocator));
		});

		function stylusCompile(str, path) {
			return stylus(str)
				.set('filename', path)
				.set('warn', true)
				.set('compress', true)
				.define('versionPath', function(urlPath) {
					return 'url(' + basic.versionPath(urlPath) + ')';
				});
		}

		app
			.set('views', __dirname + '/../views')
			.use(app.router)
			.use(function(req, res, next) {
				throw new httpErrorHandler.NotFound('404', req);
			});
	});

	app.start =  function() {
		var server;

		if (app.settings.env === 'development') {
			server = app;
		} else {
			server = cluster = cluster(app)
				.use(cluster.stats())
				.use(cluster.pidfiles('pids'))
				.use(cluster.cli());
		}

		server.listen(properties.port);

		serviceLocator.logger.info(properties.name + ' app starting in ' + app.settings.env + ' mode at ' + properties.siteUrl +
			' (pid: ' + process.pid + (cluster.isMaster ? ', master' : '') + ')');
	};
	return app;
};