module.exports = {
  name: 'Admin UI',
  description: 'Examples of the admin UI',
  version: '0.0.1',
  adminNav: [{
    label: 'Admin UI',
    url: '/admin/ui',
    section: 'admin-ui',
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
        label: 'Buttons',
        url: '#buttons',
        section: 'admin-ui'
      },
      {
        label: 'Notifications',
        url: '#notifications',
        section: 'admin-ui'
      },
      {
        label: 'Misc UI',
        url: '#misc-ui',
        section: 'admin-ui',
        items: [
          {
            label: 'Tooltips',
            url: '#tooltips',
            section: 'admin-ui'
          },
          {
            label: 'Dialogs',
            url: '#dialogs',
            section: 'admin-ui'
          },
          {
            label: 'Overlays',
            url: '#overlays',
            section: 'admin-ui'
          },
          {
            label: 'Pagination',
            url: '#pagination',
            section: 'admin-ui'
          }
        ]
      }
    ]
  }],
  initialize: [
    function(serviceLocator, done) {

      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Admin UI');

      serviceLocator.adminAccessControlList.grant('*', 'Admin UI', 'read');
      done();
    },
    function(serviceLocator, done) {
      // Create controller
      require('./controller')(serviceLocator, __dirname + '/views');
      done();
    }
  ]
};