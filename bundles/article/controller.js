var
  async = require('async'),
  httpErrorHandler = require('../../lib/httpErrorHandler'),
  viewRenderDelegate = require('../../lib/viewRenderDelegate'),
  markdown = require('markdown');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {
  var
    viewRender = viewRenderDelegate.create(bundleViewPath),
    sectionModel = serviceLocator.sectionModel,
    articleModel = serviceLocator.articleModel;


  serviceLocator.compact.
    addNamespace('blog', __dirname + '/public/')
    .addJs('/js/comments.js')
    .addJs('/js/social.js');

  function getPageContent(req, res, next) {
    var
      section = req.params.section,
      sectionQuery = {
        slug: section
      },
      article = req.params.article,
      articleQuery = {
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
      section: function(callback) {
        sectionModel.find(sectionQuery, function(error, dataSet) {
          if (!dataSet || dataSet.length() === 0) {
            return callback(true, []);
          }
          callback(null, dataSet.first().name);
        });
      },
      article: function(callback) {
        articleModel.findWithUrl(articleQuery, { limit: 100, sort: { publishedDate: -1 } },
          function(error, dataSet) {

          if (!dataSet || dataSet.length() === 0) {
            return callback(true, []);
          }
          callback(null, dataSet.toArray());
        });

      }
    }, function(error, results) {
      if ((results.section.length === 0) || (results.article.length === 0)) {
        return next();
      }
      res.article = results.article;
      res.section = results.section;

      next();
    });
  }

  app.get('/feed', function(req, res) {
    articleModel.createRss(function(error, xml) {
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    });
  });

  app.get('/blog', getPageContent,
    serviceLocator.widgetManager.load(['article::recent', 'article::categories']),
    serviceLocator.compact.js(['global'], ['blog']), function(req, res) {

    viewRender(req, res, 'list', {
      page: {
        title: 'Blog / ' + properties.pageTitle,
        section: 'blog'
      },
      layoutType: 'feature',
      title: 'list',
      articles: res.article,
      javascriptSrc: serviceLocator.versionPath(app._locals.compactJs())
    });
  });

  app.get('/:section', getPageContent,
    serviceLocator.widgetManager.load(['article::recent', 'article::categories']),
    serviceLocator.compact.js(['global'], ['blog']), function(req, res, next) {

    var section = res.section;
    if (!res.article || res.article.length === 0) {
      return next(httpErrorHandler.NotFound());
    }

    viewRender(req, res, 'list', {
      page: {
        title: section + ' / ' + properties.pageTitle,
        section: 'blog'
      },
      layoutType: 'feature',
      title: 'list',
      articles: res.article,
      javascriptSrc: serviceLocator.versionPath(app._locals.compactJs())
    });
  });

  app.get('/:section/:article', getPageContent,
    serviceLocator.widgetManager.load(['article::recent', 'article::categories', 'article::postsByAuthor']),
    serviceLocator.compact.js(['global'], ['blog']),

    function(req, res, next) {
    viewRender(req, res, 'article', {
      page: {
        title: res.article[0].title + ' by ' + res.article[0].author + ' - Clock',
        section: 'blog'
      },
      layoutType: 'feature',
      title: 'article',
      article: res.article[0],
      javascriptSrc: serviceLocator.versionPath(app._locals.compactJs())
    });
  });
};