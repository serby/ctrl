var save = require('save')
  , saveMongodb = require('save-mongodb')
  ;

module.exports = {
  name: 'Roles',
  description: 'Manage the user who administer the site',
  version: '0.0.1',
  adminNav: [{
    label: 'Roles',
    url: '/admin/role',
    section: 'role',
    permission: {
      resource: 'Role',
      action: 'read'
    },
    items: [
      {
        label: 'Add Role',
        url: '/admin/role/new',
        permission: {
          resource: 'Role',
          action: 'create'
        }
      }
    ]
  }],
  initialize: [
    function (serviceLocator, done) {
      serviceLocator.databaseConnections.main.collection('role', function (error, collection) {
        serviceLocator.saveFactory.role = function () {
          return save('role', { logger: serviceLocator.logger,
            engine: saveMongodb(collection)});
        };
        done();
      });
    },
    function (serviceLocator, done) {
      // Register the bundles models
      serviceLocator.register('roleModel',
        require('./lib/model')(serviceLocator));

      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Role');
      done();
    },
    function (serviceLocator, done) {

      //TODO: This all could be considered business logic and therefore should
      // possibly go in the model. Also maybe admin, administrator and roles
      // should all be in the admin bundle.

      function reloadAcl(callback) {
        serviceLocator.logger.info('Reloading admin ACL');
        serviceLocator.adminAccessControlList.clearGrants();
        serviceLocator.roleModel.loadAcl(serviceLocator.adminAccessControlList, callback);
      }

      // The main admin account needs this role to have ultimate power.
      serviceLocator.roleModel.ensureRootRoleExists(function (error, role) {

        if (error) {
          return done(new Error('Unable to create root role'));
        }
        if (role) {
          serviceLocator.logger.info('Role \'root\' created. ' +
            'This role has ultimate access to all resources and actions.');
        } else {
          serviceLocator.logger.info('Role \'root\' exists as expected');
        }
        // Create controllers
        require('./controller')(serviceLocator, __dirname + '/views');

        reloadAcl(function (error) {
          if (error) {
            return done(error);
          }
          serviceLocator.roleModel.on('create', reloadAcl);
          serviceLocator.roleModel.on('update', reloadAcl);

          done();
        });

      });

    }
  ]
};