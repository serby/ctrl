module.exports = {
  name: 'Article Admin',
  version: '0.0.1',
  description: 'Manage the articles on the site',
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
  publicRoute: '/',
  initialize: [
    function(serviceLocator, done) {
      done();
    },
    function(serviceLocator, done) {
      done();
    },
    function(serviceLocator, done) {
      // Create controllers
      require('./controller').createRoutes(serviceLocator.app, serviceLocator.properties, serviceLocator, __dirname + '/views');

      serviceLocator.compact.addNamespace('article-admin', __dirname + '/public/')
        .addJs('/js/article.js');

      serviceLocator.compact.addNamespace('markdown-editor', __dirname + '/public/')
        .addJs('/js/redactor/redactor.js')
        .addJs('/js/article.js');
      done();
    }

  ]
};