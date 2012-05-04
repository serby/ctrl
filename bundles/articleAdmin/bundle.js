module.exports = {
  name: 'Article Admin',
  version: '0.0.1',
  description: 'Manage the articles on the site',
  adminNav: [{
      label: 'Article',
      url: '/admin/article',
      section: 'article',
      items: [
        {
          label: 'Add Article',
          url: '/admin/article/new'
        }
      ]
    }
  ],
  publicRoute: '/',
  initialize: [
    function(serviceLocator) {
    },
    function(serviceLocator) {
    },
    function(serviceLocator) {
      // Create controllers
      require('./controller').createRoutes(serviceLocator.app, serviceLocator.properties, serviceLocator, __dirname + '/views');

      serviceLocator.compact.addNamespace('article-admin', __dirname + '/public/')
        .addJs('/js/article.js');

      serviceLocator.compact.addNamespace('markdown-editor')
        .addJs('/js/admin/markItUp/jquery.markitup.js')
        .addJs('/js/admin/markItUp/jquery.markitup.js')
        .addJs('/js/admin/markItUp/html.js')
        .addJs('/js/admin/markItUp/markdown.js')
        .addJs('/js/admin/markItUp/main.js');
    }
  ]
};