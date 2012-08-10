var
  async = require('async'),
  Entity = require('piton-entity'),
  schema = require('./roleSchema'),
  MongodbCrudDelegate = require('../../../lib/utils/mongodbCrudDelegate');

module.exports.createModel = function(properties, serviceLocator) {

  var
    collection,
    connection = serviceLocator.databaseConnections.main;

  connection.collection('role', function(error, loadedCollection) {
    collection = loadedCollection;
  });

  var
    crudDelegate,
    entityDelegate = Entity.createEntityDefinition(schema);

  entityDelegate.schema = schema;

  crudDelegate = MongodbCrudDelegate.createMongodbCrudDelegate(
    'Role',
    'Roles',
    '_id',
    collection,
    entityDelegate,
    MongodbCrudDelegate.objectIdFilter(connection)
  );

  crudDelegate.pipes.beforeCreate.add(function(entity, callback) {
    callback(null, entityDelegate.makeDefault(entity));
  });

  function createRootRole(callback) {
    crudDelegate.create({ name: 'root', grants: {'*': ['*']} }, callback);
  }

  function ensureRootRoleExisits(callback) {
    crudDelegate.find({ name: 'root'}, function(error, role) {
      if (error) {
        return callback(error);
      }
      if (role.length() === 0) {
        createRootRole(callback);
      } else {
        callback();
      }
    });
  }

  function loadAcl(acl, callback) {

    function addRoleToAcl(role) {
      Object.keys(role.grants).forEach(function(resource) {
        role.grants[resource].forEach(function(action) {
          serviceLocator.logger.silly('Adding grant \'' + role.name + '\\' +  resource  + '\\' + action + '\' to ACL');
          acl.grant(role.name, resource, action);
        });
      });
    }

    crudDelegate.find({}, function(error, roles) {

      roles.forEach(addRoleToAcl);
    });
  }

  // Public methods
  crudDelegate.ensureRootRoleExisits = ensureRootRoleExisits;
  crudDelegate.loadAcl = loadAcl;

  return crudDelegate;
};