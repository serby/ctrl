var save = require('save')
  , saveMongodb = require('save-mongodb')


module.exports = {
  name: 'Administrator',
  version: '0.0.1',
  description: 'Manage the users who administer the site',
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

      serviceLocator.databaseConnections.main.collection('administrator', function(error, collection) {
        serviceLocator.saveFactory.administrator = function() {
          return save('administrator', { logger: serviceLocator.logger,
            engine: saveMongodb(collection)})
        }
        done()
      })

    },
    function(serviceLocator, done) {

      // Register the bundles models
      serviceLocator.register('administratorModel',
        require('./lib/model')(serviceLocator))

      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Administrator')
      done()
    },
    function(serviceLocator, done) {
      // Create controllers
      require('./controller')(serviceLocator, __dirname + '/views')

      done()
    }
  ]
}