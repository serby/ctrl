/*
 * Prerequisites:
 *
 *   You need a user in the admin.system.users collection with
 *   the credentials:
 *
 *     username: theadmin
 *     password: anadminpassword
 *
 *   You can do this like so:
 *
 *      mongo localhost/admin
 *      db.addUser("theadmin", "anadminpassword")
 */

var connect = require('./create-adaptor')
  , emptyFn = function () {}
  , dummyLogger = { log: emptyFn, error: emptyFn, info: emptyFn }
  , assert = require('assert')

describe('create-adaptor', function () {

  it('should return a db and a createConnection function', function (done) {

    var serviceLocator =
      { logger: dummyLogger
      , properties:
        { database:
          { host: 'localhost'
          , port: 27017
          , name: 'ctrl-db-test'
          }
        }
      }

    var adaptor = connect(serviceLocator)
    assert.ok(adaptor.db)
    assert.ok(adaptor.createConnection)
    done()

  })

  it('should connect to a database with authentication', function (done) {

    var serviceLocator =
      { logger: dummyLogger
      , properties:
        { database:
          { host: 'localhost'
          , port: 27017
          , name: 'ctrl-test'
          , auth:
            { username: 'theadmin'
            , password: 'anadminpassword'
            }
          }
        }
      }

    var adaptor = connect(serviceLocator)
    adaptor.createConnection(function (error, connection) {
      assert.equal(error, null)
      assert.ok(connection)
      done()
    })

  })

  // it('should fail to connect to a database with invalid authentication credentials', function (done) {

  //   var serviceLocator =
  //     { logger: dummyLogger
  //     , properties:
  //       { database:
  //         { host: 'localhost'
  //         , port: 27017
  //         , name: 'ctrl-test'
  //         , auth:
  //           { username: 'userthatdoesntexist'
  //           , password: 'somesillypassword'
  //           }
  //         }
  //       }
  //     }

  //   var adaptor = connect(serviceLocator)
  //   adaptor.createConnection(function (error, connection) {
  //     assert.ok(error)
  //     done()
  //   })

  // })

})