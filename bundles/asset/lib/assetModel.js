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

  var _delete = crudDelegate.delete;
  crudDelegate.delete = function(id, cb) {
    crudDelegate.read(id, function (err, result) {
      if (err || !result) return cb(err);

      _delete(id, function (err) {
        if (err) return cb(err);
        serviceLocator.uploadDelegate.delete(
          path.join(result.path, result.basename),
          cb
        );
      });
    });
  };

  var _update = crudDelegate.update;
  crudDelegate.update = function(id, changed, cb) {
    crudDelegate.read(id, function(err, data) {
      if (err) return cb(err);

      data.title = changed.title;
      data.description = changed.description;
      data.tags = changed.tags;

      _update(id, data, cb);
    })
  };

  crudDelegate.list = function (options, cb) {
    if (!cb && typeof options === 'function') {
      cb = options;
      options = {};
    }

    crudDelegate.find({}, options, function (err, results) {
      cb(err, err ? results : results.toArray());
    });
  };

  crudDelegate.listImages = function (options, cb) {
    if (!cb && typeof options === 'function') {
      cb = options;
      options = {};
    }

    crudDelegate.find({ type: /^image\// }, options, function (err, results) {
      cb(err, err ? results : results.toArray());
    });
  };

  return crudDelegate;
}

module.exports.createModel = createModel;
