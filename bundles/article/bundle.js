var trunky = require('trunky')
  , markdown = require('markdown').markdown
  , save = require('save')
  , saveMongodb = require('save-mongodb')

module.exports = {
  name: 'Article',
  version: '0.0.1',
  description: 'Manage the articles on the site',
  publicRoute: '/article',
  adminNav: [{
      label: 'Article',
      url: '/admin/article',
      section: 'article',
      permission: {
        resource: 'Article',
        action: 'read'
      },
      items: [
        {
          label: 'Add Article',
          url: '/admin/article/new',
          permission: {
            resource: 'Article',
            action: 'create'
          }
        }
      ]
    }
  ],
  initialize: [
    function (serviceLocator, done) {

      serviceLocator.databaseConnections.main.collection('article', function (error, collection) {
        serviceLocator.saveFactory.article = function () {
          return save('article', { logger: serviceLocator.logger,
            engine: saveMongodb(collection)})
        }

        done()
      })
    },
    function (serviceLocator, done) {
      done()
    },
    function (serviceLocator, done) {

      // register the model for global usage.
      serviceLocator.register('articleModel',
        require('./lib/model')(serviceLocator));

      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Article')

      // Create controllers
      require('./controller')(serviceLocator, __dirname + '/views')

      serviceLocator.widgetManager
        .register(require('./widgets/recent')(serviceLocator))
        .register(require('./widgets/categories')(serviceLocator))
        .register(require('./widgets/postsByAuthor')(serviceLocator))

      serviceLocator.viewHelpers.truncateWithEllipsis = trunky.truncateWithEllipsis

      serviceLocator.viewHelpers.articleSummary = function (article, length) {
        if (article.summary) {
          return article.summary
        }
        var summary = article.body
        if (article.type === 'Markdown') {
          summary = markdown.toHTML(article.body)
        }
        return trunky.truncateWithEllipsis(summary, length)
      }

      done()
    }
  ]

}