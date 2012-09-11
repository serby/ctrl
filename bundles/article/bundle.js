var trunky = require('trunky')
  , markdown = require('markdown').markdown;

module.exports = {
  name: 'Article',
  version: '0.0.1',
  description: 'Manage the articles on the site',
  publicRoute: '/article',
  initialize: [
    function(serviceLocator, done) {

      // Add some JavaScript to be compacted
      serviceLocator.compact
        .addNamespace('article', __dirname + '/public/')
        .addJs('/js/comments.js')
        .addJs('/js/social.js');

      // Register the bundles models
      serviceLocator.register('articleModel',
        require('./lib/articleModel').createModel(serviceLocator.properties,
          serviceLocator));
      done();
    },
    function(serviceLocator, done) {

      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Article');
      done();
    },
    function(serviceLocator, done) {

      // Create controllers
      require('./controller')(serviceLocator,
        serviceLocator, __dirname + '/views');

      serviceLocator.widgetManager
        .register(require('./widgets/recent')(serviceLocator))
        .register(require('./widgets/categories')(serviceLocator))
        .register(require('./widgets/postsByAuthor')(serviceLocator))
        ;

      serviceLocator.viewHelpers.truncateWithEllipsis = trunky.truncateWithEllipsis;

      serviceLocator.viewHelpers.articleSummary = function(article, length) {
        if (article.summary) {
          return article.summary;
        }
        var summary = article.body;
        if (article.type === 'Markdown') {
          summary = markdown.toHTML(article.body);
        }
        return trunky.truncateWithEllipsis(summary, length);
      };

      done();
    }
  ]

};