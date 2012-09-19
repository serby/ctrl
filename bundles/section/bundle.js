var save = require('save')
  , saveMongodb = require('save-mongodb')
  ;

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
    function (serviceLocator, done) {

      serviceLocator.databaseConnections.main.collection('section', function(error, collection) {
        serviceLocator.saveFactory.section = function() {
          return save('section', { logger: serviceLocator.logger,
            engine: saveMongodb(collection)});
        };
        done();
      });

    },
    function (serviceLocator, done) {
      serviceLocator.register('sectionModel',
        require('./lib/model')(serviceLocator));

      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Section');
      done();
    },
    function (serviceLocator, done) {
      // Create controllers
      require('./controller')(serviceLocator, __dirname + '/views');
      done();
    }
  ]
};