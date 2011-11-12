var
	async = require('async'),
	Pipe = require('piton-pipe'),
	DataSet = require('./dataSet'),
	emptyFunction = function() {},
	proxyFunction = function(value) { return value; };

module.exports.createMongodbCrudDelegate = function(name, plural, idProperty, collection, entityDelegate, idFilter, logger) {

	var
		self = {},
		pipes = {
			beforeCreate: Pipe.createPipe(),
			beforeUpdate: Pipe.createPipe(),
			beforeDelete: Pipe.createPipe()
		};

	// Ensure that we have some form of logger
	logger = logger || console;

	function validate(validationSet, entityObject, callback) {
		entityDelegate.validate(entityObject, validationSet, function(errors) {
			callback(Object.keys(errors).length === 0 ? null : errors, entityObject);
		});
	}

	function create(entityObject, options, callback) {
		var
			errors,
			cleanEntityObject =
			 this.entityDelegate.castProperties(
					this.entityDelegate.stripUnknownProperties(entityObject)
				),
				pipe = Pipe.createPipe();

			// Append validator to the process pipe.
			pipe
			.add(validate.bind(this, undefined))
			.add(function(value, callback) {
				pipes.beforeCreate.run(value, callback);
			})
			.run(cleanEntityObject, function(error, processedEntityObject) {
				if (error) {
					return callback(error, entityObject);
				}
				// Remove this from the update because it is the identity field and can't be changed.
				delete processedEntityObject[idProperty];
				collection.insert(processedEntityObject, { safe: true }, function(error, storedEntityObject) {
					if (error === null) {
						logger.info(name + ' created ', storedEntityObject);
						callback(null, storedEntityObject[0]);
					} else {
						logger.warn('Error on create', error, storedEntityObject);
						callback(error, entityObject);
					}
				});
			}
		);
	}

	function read(id, callback) {
		var
			query = {};

		query[idProperty] = idFilter(id);
		collection.findOne(query, function(errors, entityObject) {
			if (errors) {
				callback(errors, null);
			}	else if (entityObject === undefined) {
				callback(new RangeError('Unable to find ' + name + ' with ' + idProperty + ' = ' + id), null);
			} else {
				callback(null, entityObject);
			}
		});
	}

	function update(id, entityObject, options, callback) {

		var
			errors,
			cleanEntityObject = entityDelegate.castProperties(
				entityDelegate.stripUnknownProperties(entityObject, options.tag)
			),
			pipe = Pipe.createPipe();

		// Append to validator to the process pipe.
		pipe.add(validate.bind(self, options.validationSet));

		pipe.add(function(value, callback) {
			pipes.beforeUpdate.run(value, callback);
		});

		pipe.run(cleanEntityObject, function(error, processedEntityObject) {
			if (error) {
				return callback(error, entityObject);
			}
			var query = {};
			query[idProperty] = idFilter(id);
			// Remove this from the update because it is the identity field and can't be changed.
			delete processedEntityObject[idProperty];
			collection.findAndModify(query, [[id, 'asc']], { $set : processedEntityObject }, { 'new': true }, function (error, returnEntity) {
				if (error === null) {
					logger.info(name + ' updated ', returnEntity);
					callback(null, returnEntity);
				} else {
					logger.warn('Error on update', error, returnEntity);
					// Return the same object that was passed in, so the user can see problems.
					callback(error, entityObject);
				}
			});
		});
	}

	function deleteById(id, callback) {
		var query = {};
		query[idProperty] = idFilter(id);
		collection.remove(query, function (error, data) {
			if (error) {
				callback(error, null);
			} else {
				logger.info(name + ' deleted ', id, query);
				callback(null, data);
			}
		});
	}

	function count(query, callback) {
		collection.count(query, function(error, count) {
			callback(error, count);
		});
	}

	/**
	 * Returns a collection of entities
	 *
	 * You can omit the options parameter and just pass find(query, callback)
	 *
	 * @param {Object} query What to find
	 * @param {Object} options How to manage the results set. See https://github.com/christkv/node-mongodb-native for full options
	 * @param {Function} callback Called with the results or error callback(error, dataSet)
	 */
	function find(query, options, callback) {
		if (typeof options === 'function') {
			callback = options;
			options = {};
		}
		collection.find(query, options).toArray(function(errors, data) {
			if (errors) {
				callback(errors, null);
			} else {
				callback(null, DataSet.createDataSet(entityDelegate, data));
			}
		});
	}

	return {
		name: name,
		plural: plural,
		idProperty: idProperty,
		urlName: name.toLowerCase().replace(' ', '-').replace(/[^a-z0-9]/, ''),
		create: create,
		read: read,
		update: update,
		'delete': deleteById,
		validate: validate,
		find: find,
		count: count,
		entityDelegate: entityDelegate,
		pipes: pipes
	};
};

module.exports.objectIdFilter = function(connection) {
	return function(id) {
		return new connection.bson_serializer.ObjectID(id);
	};
};

module.exports.proxyFilter = function(id) {
	return id;
};