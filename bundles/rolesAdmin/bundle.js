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
    function(serviceLocator, done) {

      // Register the bundles models
      serviceLocator.register('roleModel',
        require('./lib/roleModel').createModel(serviceLocator.properties, serviceLocator));
      done();
    },
    function(serviceLocator, done) {
      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Role');
      done();
    },
    function(serviceLocator, done) {

      function reloadAcl() {
        serviceLocator.logger.info('Reloading admin ACL');
        serviceLocator.adminAccessControlList.clearGrants();
        serviceLocator.roleModel.loadAcl(serviceLocator.adminAccessControlList);
      }

      reloadAcl();

      serviceLocator.roleModel.on('onCreate', reloadAcl);
      serviceLocator.roleModel.on('onUpdate', reloadAcl);

      // The main admin account needs this role to have ultimate power.
      serviceLocator.roleModel.ensureRootRoleExisits(function(error, role) {

        if (error) {
          return done(new Error('Unable to create root role'));
        }
        if (role) {
          serviceLocator.logger.info('Role \'root\' created. ' +
            'This role has ultimate access to all resources and actions.');
        } else {
          serviceLocator.logger.info('Role \'root\' exists as expected');
        }
        done();
      });

      // Create controllers
      require('./controller').createRoutes(serviceLocator.app, serviceLocator.properties, serviceLocator, __dirname + '/views');

    }
  ]
};