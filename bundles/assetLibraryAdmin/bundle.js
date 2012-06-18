module.exports = {
  name: 'Asset Library',
  version: '0.0.1',
  description: 'Upload and manage assets',
  adminNav: [{
    label: 'Assets',
    url: '/admin/assets',
    section: 'assets',
    items: [
      {
        label: 'Form Elements',
        url: '#form-elements',
        section: 'admin-ui'
      },
      {
        label: 'Tables',
        url: '#tables',
        section: 'admin-ui'
      },
      {
        label: 'Misc UI',
        url: '#misc-ui',
        section: 'admin-ui'
      }
    ]
  }],
  initialize: [
    function(serviceLocator) {

      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Asssets');

    },
    function(serviceLocator) {
      // Create controller
      require('./controller').createRoutes(
        serviceLocator.app,
        serviceLocator.properties,
        serviceLocator,
        __dirname + '/views'
      );
    }
  ]
};