module.exports = createAdaptor

var Db = require('mongodb').Db
  , ReplSetServers = require('mongodb').ReplSetServers
  , Server = require('mongodb').Server

/*
 * Create an object that has a reference
 * to the database, and a helper function to
 * create connections to it:
 *
 *   { db [Object], createConnection [Function] }
 */
function createAdaptor(serviceLocator) {

  var dbProperties = serviceLocator.properties.database
    , logger = serviceLocator.logger
    , serverData
    , db

  if (dbProperties.replSet === undefined) {

    serverData = new Server(
        dbProperties.host
      , dbProperties.port
      , { auto_reconnect: true })

  } else {

    var servers = dbProperties.replSet.servers.map(function(server) {
      return new Server(
          server.host
        , server.port
        , { auto_reconnect: true })
    })

    serverData = new ReplSetServers(
        servers
      , { rs_name: dbProperties.replSet.name
        , read_secondary: false
        })
  }

  db = new Db(dbProperties.name, serverData)

  /*
   * Helper function for creating connections to the database
   */
  function createConnection(callback) {

    var timeout
      , timedOut = false

    function dbTimeout() {
      logger.error('Database connection attempt timed out', dbProperties.name)
      callback(new Error('Database connection attempt timed out'))
    }

    function auth(connection, callback) {
      db.authenticate(
        dbProperties.auth.username,
        dbProperties.auth.password,
        function(err) {
          if (err) {
            logger.error('Database authentication error', dbProperties.name, err)
            callback('Database authentication error')
          } else {
            if (!timedOut) {
              callback(null, connection)
            }
          }
        })
    }

    function handleConnectionAttempt(error, connection) {
      clearTimeout(timeout)
      if (error) {
        logger.error('Error connecting to database', dbProperties.name, error)
        if (error === 'connection already opened') {
          callback(null, db)
        } else {
          callback(new Error('Error connection to database'))
        }
      } else {
        logger.info('Connected to database ' + dbProperties.name)
        if (dbProperties.auth) {
          auth(connection, callback)
        } else {
          if (!timedOut) {
            callback(null, connection)
          }
        }
      }
    }


    // Timout after 10 seconds
    timeout = setTimeout(dbTimeout, 10 * 1000)
    logger.info('Connecting to database ' + dbProperties.name)
    db.open(handleConnectionAttempt)

  }

  return { createConnection: createConnection, db: db }
}