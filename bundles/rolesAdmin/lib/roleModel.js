var
	async = require('async'),
	Entity = require('piton-entity'),
	schema = require('./roleEntitySchema'),
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

	return crudDelegate;
};