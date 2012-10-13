var Db = require('mongodb').Db
  , ReplSetServers = require('mongodb').ReplSetServers
  , Server = require('mongodb').Server

module.exports = function createDatabaseAdaptor(serviceLocator) {

  var serverData
    , properties = serviceLocator.properties
    , db


  if (properties.database.replSet === undefined) {

    serverData = new Server(properties.database.host, properties.database.port, { auto_reconnect: true })

  } else {

    var servers = properties.database.replSet.servers.map(function(server) {
      return new Server(
          server.host
        , server.port
        , { auto_reconnect: true })
    })

    serverData = new ReplSetServers(servers, { rs_name: properties.database.replSet.name, read_secondary: false })

  }

  db = new Db(properties.database.name, serverData)

  function createConnection(callback) {

    var timeout = setTimeout(function() {
      serviceLocator.logger.error('Database connection attempt timed out', properties.database.name)
      process.exit(1)
    }, 10 * 1000)

    serviceLocator.logger.info('Connecting to database ' + properties.database.name)

    db.open(function(error, connection) {
      clearTimeout(timeout)

      if (error) {
        serviceLocator.logger.error('Error connecting to database', properties.database.name, error)
        if (error === 'connection already opened') {
          callback(db)
        } else {
          process.exit(1)
        }
      } else {
        serviceLocator.logger.info('Connected to database ' + properties.database.name)
        if (properties.database.auth) {
          db.authenticate(
            properties.database.auth.username,
            properties.database.auth.password,
            function(err) {
              if (err) {
                serviceLocator.logger.error('Error authenticating with database', properties.database.name, err)
                process.exit(1)
              } else {
                callback(connection)
              }
            })
        } else {
          callback(connection)
        }
      }
    })
  }

  return (
    { createConnection: createConnection
    , db: db
    })
}