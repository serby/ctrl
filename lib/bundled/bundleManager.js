var
	path = require('path');

module.exports.createBundleManager = function(serviceLocator) {

	var
		self = {},
		bundles = {};

	function add(bundle) {

		if (bundles[bundle.name] !== undefined) {
			throw new Error('Bundle has already been added. ' +
				'It is likely that you have two bundles with the same name: ' +
				bundle.name + (bundle.description ? ' "' + bundle.description + '"' : ''));
		}

		bundles[bundle.name] = bundle;
	}

	function addByPath(bundlePath) {
		if (path.existsSync(bundlePath)) {
			var bundle = require(bundlePath);
			bundle.path = path.dirname(bundlePath);
			add(bundle);
		} else {
			throw new Error('Unable to find bundle:' + bundlePath);
		}
	}

	function addBundles(bundlePath, bundles) {
		bundles.forEach(function(bundle) {
			serviceLocator.logger.verbose('Adding bundle: ' + bundle);
			addByPath(bundlePath + '/' + bundle + '/bundle.js');
		});
	}

	function get(propertyName, compare) {
		var returned = [];
		if (compare === undefined) {
			compare = function(value) { return value !== undefined; };
		}
		Object.keys(bundles).forEach(function(key) {
			var bundle = bundles[key];
			if (bundle[propertyName] === undefined) {
				return false;
			}
			if (compare(bundle[propertyName])) {
				if (Array.isArray(bundle[propertyName])) {
					returned = returned.concat(bundle[propertyName]);
				} else {
					returned.push(bundle[propertyName]);
				}
			}
		});
		return returned;
	}

	function forEachProperty(property, callback) {
		Object.keys(bundles).forEach(function(key) {
			var bundle = bundles[key];
			if (bundle[property] === undefined) {
				console.log('Not found %s in bundle %s', property, bundle.name);
				return false;
			}
			if (!Array.isArray(bundle[property])) {
				bundle[property] = [bundle[property]];
			}
			bundle[property].forEach(function(item) {
				callback(bundle, item);
			});
		});
	}

	function initBundles(app, properties) {

		// Init Bundles
		Object.keys(bundles).forEach(function(key) {

			var
				bundle = bundles[key],
				property = 'register';

			if ((bundle[property] !== undefined) && (typeof bundle[property] === 'function')) {
				serviceLocator.logger.verbose('Bootstraping Bundle: ' + bundle.name);
				bundle[property](app, properties, serviceLocator);
			}
		});

		Object.keys(bundles).forEach(function(key) {

			var
				bundle = bundles[key],
				property = 'configure';

			if ((bundle[property] !== undefined) && (typeof bundle[property] === 'function')) {
				serviceLocator.logger.verbose('Configuring Bundle: ' + bundle.name);
				bundle[property](app, properties, serviceLocator);
			}
		});

		Object.keys(bundles).forEach(function(key) {

			var
				bundle = bundles[key],
				property = 'finalise';

			if ((bundle[property] !== undefined) && (typeof bundle[property] === 'function')) {
				serviceLocator.logger.verbose('Finalising Bundle: ' + bundle.name);
				bundle[property](app, properties, serviceLocator);
			}
		});
	}

	self = {
		addByPath: addByPath,
		get: get,
		forEachProperty: forEachProperty,
		addBundles: addBundles,
		initBundles: initBundles
	};

	return self;

};

module.exports.bundle = {
	name: '',
	controllers: [],
	services: [],
	nav: [],
	adminNav: []
};