module.exports = {
  name: 'Section',
  version: '0.0.1',
  description: 'Manage the sections on the site',
  adminNav: [{
      label: 'Section',
      url: '/admin/section',
      section: 'section',
      permission: {
        resource: 'Section',
        action: 'read'
      },
      items: [
        {
          label: 'Add Section',
          url: '/admin/section/new',
          permission: {
            resource: 'Section',
            action: 'read'
          }
        }
      ]
    }
  ],
  initialize: [
    function(serviceLocator, done) {
      // Register the bundles models
      serviceLocator.register('sectionModel',
        require('./lib/sectionModel').createModel(serviceLocator.properties, serviceLocator));
      done();
    },
    function(serviceLocator, done) {
      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Section');
      done();
    },
    function(serviceLocator, done) {
      // Create controllers
      require('./controller')(serviceLocator.app,
        serviceLocator.properties, serviceLocator, __dirname + '/views');
      done();
    }
  ]
};