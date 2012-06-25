module.exports = {
  name: 'Administrator',
  version: '0.0.1',
  description: 'Manage the user who administer the site',
  adminNav: [{
      label: 'Administrators',
      url: '/admin/administrator',
      section: 'administrator',
      permission: {
        resource: 'Administrator',
        action: 'read'
      },
      items: [
        {
          label: 'Add Administrator',
          url: '/admin/administrator/new',
          permission: {
            resource: 'Administrator',
            action: 'create'
          }
        }
      ]
    }
  ],
  initialize: [
    function(serviceLocator, done) {

      // Register the bundles models
      serviceLocator.register('administratorModel',
        require('./lib/administratorModel').createModel(serviceLocator.properties, serviceLocator));

      done();
    },
    function(serviceLocator, done) {
      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Administrator');
      done();
    },
    function(serviceLocator, done) {
      // Create controllers
      require('./controller').createRoutes(serviceLocator.app,
        serviceLocator.properties, serviceLocator, __dirname + '/views');

      done();
    }
  ]
};