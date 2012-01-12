var
	async = require('async'),
	crypto = require('crypto'),
	Entity = require('piton-entity'),
	schema = require('./administratorEntitySchema'),
	MongodbCrudDelegate = require('../../../lib/utils/mongodbCrudDelegate');

module.exports.createModel = function(properties, serviceLocator) {

	var
		collection,
		connection = serviceLocator.databaseConnections.main,
		salt = 'secret';

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

	function saltyHash(salt, value) {
		return crypto.createHash('sha1').update(salt + value).digest('hex');
	}

	function duplicateEmailChecker(entity, callback) {
		collection.find({ emailAddress: entity.emailAddress }).toArray(function(error, data) {
			callback(data.length === 0 || data[0]._id.toString() === entity._id ? null : { emailAddress: 'Already in use' }, entity);
		});
	}

	function passwordHasher(entity, callback) {
		if (entity.password) {
			entity.password = saltyHash(salt, entity.password);
		}
		callback(null, entity);
	}

	function authenticate(credentials, callback) {
		crudDelegate.find({ emailAddress: credentials.emailAddress, password: saltyHash(salt, credentials.password) }, {}, function(errors, items) {

		if (errors) {
				callback(errors, credentials);
			} else if (items.length() === 0) {
				callback(new Error('Wrong Email and password combination.'), credentials);
			} else {
				callback(null, items.first());
			}
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