var
  async = require('async'),
  crypto = require('crypto'),
  Entity = require('piton-entity'),
  schema = require('./sectionEntitySchema'),
  MongodbCrudDelegate = require('../../../lib/utils/mongodbCrudDelegate');

module.exports.createModel = function(properties, serviceLocator) {

  var
    collection,
    connection = serviceLocator.databaseConnections.main;

  connection.collection('section', function(error, loadedCollection) {
    collection = loadedCollection;
  });

  var
    crudDelegate,
    entityDelegate = Entity.createEntityDefinition(schema);

  entityDelegate.schema = schema;

  crudDelegate = MongodbCrudDelegate.createMongodbCrudDelegate(
    'Section',
    'Sections',
    '_id',
    collection,
    entityDelegate,
    MongodbCrudDelegate.objectIdFilter(connection),
    serviceLocator.logger
  );

  crudDelegate.pipes.beforeCreate.add(function(entity, callback) {
    callback(null, entityDelegate.makeDefault(entity));
  });

  return crudDelegate;
};