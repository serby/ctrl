var
  async = require('async'),
  bcrypt = require('bcrypt'),
  Entity = require('piton-entity'),
  schema = require('./administratorEntitySchema'),
  MongodbCrudDelegate = require('../../../lib/utils/mongodbCrudDelegate');

module.exports.createModel = function(properties, serviceLocator) {

  var
    collection,
    connection = serviceLocator.databaseConnections.main;

  if (typeof properties.bcryptWorkFactor === 'number' && properties.bcryptWorkFactor >= 1) {
    properties.bcryptWorkFactor = Math.round(properties.bcryptWorkFactor);
  } else {
    properties.bcryptWorkFactor = 1;
  }

  connection.collection('administrator', function(error, loadedCollection) {
    collection = loadedCollection;
  });

  var
    crudDelegate,
    entityDelegate = Entity.createEntityDefinition(schema);

  entityDelegate.schema = schema;

  crudDelegate = MongodbCrudDelegate.createMongodbCrudDelegate(
    'Administrator',
    'Administrators',
    '_id',
    collection,
    entityDelegate,
    MongodbCrudDelegate.objectIdFilter(connection),
    serviceLocator.logger
  );

  function bcryptHash(value, callback) {
    bcrypt.hash(value, properties.bcryptWorkFactor, callback);
  }

  function bcryptCompare(value, hash, callback) {
    bcrypt.compare(value, hash, callback);
  }

  function duplicateEmailChecker(entity, callback) {
    collection.find({ emailAddress: entity.emailAddress }).toArray(function(error, data) {
      callback(data.length === 0 || data[0]._id.toString() === entity._id ? null : MongodbCrudDelegate.validationError({ emailAddress: 'Already in use' }), entity);
    });
  }

  function passwordHasher(entity, callback) {
    if (entity.password) {
      bcryptHash(entity.password, function(err, hash) {
        if (err) {
          callback(err);
        } else {
          entity.password = hash;
          callback(null, entity);
        }
      });
    } else {
      callback(null, entity);
    }
  }

  function authenticate(credentials, callback) {
    crudDelegate.findOne({ emailAddress: credentials.emailAddress }, function(err, entity) {
      if (err) {
        return callback(err, credentials);
      } else if (!entity) {
        return callback(new Error('Wrong Email and password combination.'), credentials);
      }

      bcrypt.compare(credentials.password, entity.password, function(err, match) {
        if (err) {
          return callback(err, credentials);
        } else if (!match) {
          return callback(new Error('Wrong Email and password combination.'), credentials);
        }

        return callback(null, entity);
      });
    });
  }

  function dontSetBlankPassword(entity, callback) {
    if (entity.password === '') {
      delete entity.password;
    }
    callback(null, entity);
  }

  /**
   * Create a new administrator with the '*' role which
   * will allow full access to all admin bundles that have been created correctly
   */
  function createWithFullAccess(administratorDetails, callback) {

    administratorDetails.roles = ['root'];

    crudDelegate.create(administratorDetails, {}, callback);
  }

  crudDelegate.pipes.beforeCreate.add(function(entity, callback) {
    callback(null, entityDelegate.makeDefault(entity));
  })
    .add(duplicateEmailChecker)
    .add(passwordHasher);

  crudDelegate.pipes.beforeUpdate
    .add(duplicateEmailChecker)
    .add(passwordHasher)
    .add(dontSetBlankPassword);

  crudDelegate.authenticate = authenticate;
  crudDelegate.createWithFullAccess = createWithFullAccess;

  return crudDelegate;
};