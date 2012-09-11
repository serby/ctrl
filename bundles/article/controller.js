var async = require('async')
  , markdown = require('markdown')
  ;

function createRoutes (serviceLocator, viewPath) {

  var viewRender = serviceLocator.viewRender(viewPath)
    , sectionModel = serviceLocator.sectionModel
    , articleModel = serviceLocator.articleModel;

  function getPageContent(req, res, next) {
    var section = req.params.section
      , sectionQuery = {
        slug: section
      }
      , article = req.params.article
      , articleQuery = {
        section: section,
        slug: article
      };

    if (!article) {
      delete articleQuery.slug;
    }

    if (!section) {
      delete articleQuery.section;
      delete sectionQuery.slug;
    }

    async.series({
      section: function (callback) {
        sectionModel.find(sectionQuery, function (error, dataSet) {
          if (!dataSet || dataSet.length() === 0) {
            return callback(true, []);
          }
          callback(null, dataSet.first());
        });
      },
      article: function (callback) {
        articleModel.findWithUrl(articleQuery, { limit: 100, sort: { created: -1 } },
          function (error, dataSet) {

          if (!dataSet || dataSet.length() === 0) {
            return callback(true, []);
          }
          callback(null, dataSet.toArray());
        });

      }
    }, function (error, results) {
      if ((results.section.length === 0) || (results.article.length === 0)) {
        return next(new serviceLocator.httpErrorHandler.NotFound());
      }
      res.article = results.article;
      res.section = results.section;

      next();
    });
  }

  serviceLocator.app.get(
    '/:section',
    getPageContent,
    serviceLocator.widgetManager.load(
      ['article::recent', 'article::categories']
    ),
    function (req, res, next) {

      var section = res.section;
      if (!res.article || res.article.length === 0) {
        return next(new serviceLocator.httpErrorHandler.NotFound());
      }

      viewRender(req, res, 'list', {
        page: {
          title: section.name + ' / ' + serviceLocator.properties.pageTitle,
          section: section.slug
        },
        layoutType: 'feature',
        title: 'list',
        section: res.section,
        articles: res.article
      });

    }
  );

  serviceLocator.app.get(
    '/:section/:article',
    getPageContent,
    serviceLocator.widgetManager.load([
      'article::recent', 'article::categories', 'article::postsByAuthor'
    ]),
    serviceLocator.compact.js([['global'], ['article']]),
    function (req, res, next) {

      viewRender(req, res, 'article', {
        page: {
          title: res.article[0].title + ' by ' + res.article[0].author,
          section: res.section.slug
        },
        layoutType: 'feature',
        title: 'article',
        section: res.section,
        article: res.article[0]
      });

  });
}

module.exports.createRoutes = createRoutes;