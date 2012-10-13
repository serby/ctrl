// Configure ctrl to use this bundle.

// The bundle uses save for model persistences and in this case the mongodb
// engine.
var save = require('save')
  , saveMongodb = require('save-mongodb')
  ;

module.exports = {

  // The name of the bundle. This will be used in logging etc.
  name: 'Section',

  // Let people know what this bundle does.
  description: 'Manage the sections on the site',

  // Current version of this bundle.
  version: '0.0.1',

  // Any custom properties can be added. adminNav it used by the 'admin' bundle
  // to automatically build the admin navigation.
  adminNav: [{
    // Top level menu label
    label: 'Section',
    url: '/admin/section',
    section: 'section',

    // What role you need to see the menu item.
    permission: {
      resource: 'Section',
      action: 'read'
    },
    // List all the sub menu items
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
  }],

  // ## Initialization
  // All the loaded bundles have their initialize functions run one after
  // another on startup. If an array is provided instead of a function then all
  // initialize[0] level functions are run across all the bundles before
  // initialize[1] level. This is a good way to manage circular dependencies.
  initialize: [
    function (serviceLocator, done) {

      // Get the main database connection which in this case is a
      // mongodb connnect. Then connect to the collection 'section' and
      // create a new save instance for sections using that collection in the
      // save-mongodb engine.
      serviceLocator.databaseConnections.main.collection('section', function(error, collection) {
        serviceLocator.saveFactory.section = function() {
          return save('section', { logger: serviceLocator.logger,
            engine: saveMongodb(collection)});
        };

        done();
      });

    },
    function (serviceLocator, done) {

      // register the section model for global usage.
      serviceLocator.register('sectionModel',
        require('./lib/model')(serviceLocator));

      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Section');

      // Add the controller routes
      require('./controller')(serviceLocator, __dirname + '/views');

      done();
    }
  ]
};