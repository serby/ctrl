var Entity = require('piton-entity')
  , schema = require('./assetEntitySchema')
  , MongodbCrudDelegate = require('../../../lib/utils/mongodbCrudDelegate')
  , path = require('path');


function createModel(properties, serviceLocator) {

  var collection
    , connection = serviceLocator.databaseConnections.main;

  connection.collection('asset', function(error, loadedCollection) {
    collection = loadedCollection;
  });

  var crudDelegate
    , entityDelegate = Entity.createEntityDefinition(schema);

  entityDelegate.schema = schema;

  crudDelegate = MongodbCrudDelegate.createMongodbCrudDelegate(
    'Asset',
    'Assets',
    '_id',
    collection,
    entityDelegate,
    MongodbCrudDelegate.objectIdFilter(connection),
    serviceLocator.logger
  );

  crudDelegate.pipes.beforeCreate.add(function(entity, callback) {
    callback(null, entityDelegate.makeDefault(entity));
  });

  return {

    create: function (asset, cb) {
      crudDelegate.create(asset, function (err, results) {
        cb(err, results);
      });
    },

    delete: function (id, cb) {

      crudDelegate.read(id, function (err, result) {

        if (err || !result) {
          return cb(err);
        }

        crudDelegate.delete(id, function (err) {
          if (err) {
            return cb(err);
          }
          serviceLocator.uploadDelegate.delete(
            path.join(result.path, result.basename),
            cb
          );
        });

      });

    },

    list: function (options, cb) {

      if (!cb && typeof options === 'function') {
        cb = options;
        options = {};
      }

      crudDelegate.find({}, options, function (err, results) {
        if (err) {
          cb(err);
        } else {
          cb(null, results.toArray());
        }
      });
    }
  };

}

module.exports.createModel = createModel;