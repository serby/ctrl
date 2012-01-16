var
	Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server;

module.exports.createDatabaseAdaptor = function(properties, serviceLocator) {

	var
		server = new Server(properties.database.host, properties.database.port, { auto_reconnect: true }),
		db = new Db(properties.database.name, server);

	function createConnection(callback) {

		db.open(function(error, connection) {
			if (error) {
				serviceLocator.logger.error('Error connecting to database', properties.database.name, error);
				if (error === 'connection already opened') {
					callback(db);
				} else {
					process.exit(1);
				}
			} else {
				serviceLocator.logger.info('Connecting to database ' + properties.database.name);
				callback(connection);
			}
		});
	}

	return {
		createConnection: createConnection,
		db: db
	};
};