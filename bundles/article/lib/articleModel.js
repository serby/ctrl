var
	Entity = require('piton-entity'),
	schema = require('./articleEntitySchema'),
	MongodbCrudDelegate = require('../../../lib/utils/mongodbCrudDelegate'),
	path = require('path'),
	url = require('url');

module.exports.createModel = function(properties, serviceLocator) {

	var
		collection,
		connection = serviceLocator.databaseConnections.main;

	connection.collection('article', function(error, loadedCollection) {
		collection = loadedCollection;
	});

	var
		crudDelegate,
		entityDelegate = Entity.createEntityDefinition(schema);

	entityDelegate.schema = schema;

	crudDelegate = MongodbCrudDelegate.createMongodbCrudDelegate(
		'Article',
		'Articles',
		'_id',
		collection,
		entityDelegate,
		MongodbCrudDelegate.objectIdFilter(connection),
		serviceLocator.logger
	);

	function findWithUrl(query, options, callback) {

		// Ensuring all queries shown to the front end are live
		if (typeof query.live === 'undefined') {
			query.live = true;
		}

		crudDelegate.find(query, options, function(error, articles) {
			if (error) {
				return callback(error);
			}
			articles.forEach(function(article) {
				//Constructing the url of the page for fb like and G+ buttons
				article.path = path.join('/', article.section, article.slug);
				article.url = url.resolve(
					properties.siteUrl,
					path.join(
						article.section,
						article.slug
					)
				);
			});
			callback(error, articles);
		});
	}

	crudDelegate.pipes.beforeCreate.add(function(entity, callback) {
		callback(null, entityDelegate.makeDefault(entity));
	});

	crudDelegate.findWithUrl = findWithUrl;

	return crudDelegate;
};