var Db = require('mongodb').Db
  , Connection = require('mongodb').Connection
  , ReplSetServers = require('mongodb').ReplSetServers
  , Server = require('mongodb').Server;

module.exports.createDatabaseAdaptor = function(properties, serviceLocator) {

  var serverData
    , db;

  if (properties.database.replSet === undefined) {

    serverData = new Server(properties.database.host, properties.database.port, { auto_reconnect: true });

  } else {

    var servers = properties.database.replSet.servers.map(function(server) {
      return new Server(
        server.host,
        server.port,
        { auto_reconnect: true });
    });

    serverData = new ReplSetServers(servers, { rs_name: properties.database.replSet.name, read_secondary: false });

  }

  db = new Db(properties.database.name, serverData);

  function createConnection(callback) {

    serviceLocator.logger.info('Connecting to database ' + properties.database.name);

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