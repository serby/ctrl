var
  Entity = require('piton-entity'),
  schema = require('./articleEntitySchema'),
  MongodbCrudDelegate = require('../../../lib/utils/mongodbCrudDelegate'),
  path = require('path'),
  url = require('url'),
  RSS = require('rss');

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

  function createRss(callback) {

    var feed = new RSS({
      title: 'Clock Blog',
      description: 'Clock Blog',
      feed_url: url.resolve(properties.siteUrl, '/feed'),
      site_url: properties.siteUrl,
      image_url: url.resolve(properties.siteUrl, '/favicon.ico'),
      author: 'Clock Ltd'
    });

    crudDelegate.findWithUrl({}, { sort: { publishedDate: -1 } }, function(error, dataSet) {
      if (error) {
        return callback(error);
      }
      dataSet.forEach(function(article) {
        feed.item({
          title: article.title,
          description: article.body,
          url: article.url,
          author: article.author,
          date: article.publishedDate
        });
      });

      callback(null, feed.xml());
    });
  }

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
    var e = entityDelegate.makeDefault(entity);
    e.publishedDate = new Date(e.publishedDate);
    callback(null, e);
  });

  // Co-erce any stringy date into an actual date
  crudDelegate.pipes.beforeUpdate.add(function(entity, callback) {
    entity.publishedDate = new Date(entity.publishedDate);
    callback(null, entity);
  });

  crudDelegate.findWithUrl = findWithUrl;
  crudDelegate.createRss = createRss;

  return crudDelegate;
};