var
	_ = require('underscore'),
	basePort = 3020;

var properties = {
	version: '0.0.1',
	name: 'Control',
	tagline: 'Control CMS by Paul Serby',
	description: 'This is the inital config',
	keywords: 'Control',
	pageTitle: 'Control CMS',
	port: basePort + 1,
	email: 'paul.serby@clock.co.uk',
	siteUrl: 'http://localhost:' + (basePort + 1),
	logPath: __dirname + '/logs',
	cachePath: __dirname + '/cache',
	dataPath: __dirname + '/data',
	binaryCachePath: '/image/',
	database: {
		host: '127.0.0.1',
		port: 27017,
		name: 'Control-Development'
	},
	defaultSearchResultSize: 30
};

var environmentProperties = {
	development: {},
	testing: {
		siteUrl: 'http://localhost:' + (basePort + 2),
		port: basePort + 2,
		hosts: [
			{
				host: 'localhost',
				sshPort: 22
			}
		],
		database: {
			replSet: {
				name: 'Control',
				servers: [
					{ host: 'localhost', port: 28000 },
					{ host: 'localhost', port: 28001 }
				]
			},
			name: 'Control-Testing'
		}
	},
	production: {
		siteUrl: 'http://localhost:' + (basePort + 3),
		port: basePort + 3,
		email: 'paul.serby@clock.co.uk',
		hosts: [
			{
				host: '',
				sshPort: 17510
			}
		],
		database: {
			host: '127.0.0.1',
			port: 27017,
			name: 'Control-Production'
		}
	}
};

exports.getProperties = function(environment) {
	environment = environment || process.env.NODE_ENV || 'development';

	if (environmentProperties[environment] === undefined) {
		throw new RangeError('No properties for environment \'' + environment + '\'');
	}
	return _.extend(properties, environmentProperties[environment]);
};