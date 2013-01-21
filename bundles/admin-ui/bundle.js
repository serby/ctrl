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
        url: '/admin/ui#form-elements',
        section: 'admin-ui'
      },
      {
        label: 'Tables',
        url: '/admin/ui#tables',
        section: 'admin-ui'
      },
      {
        label: 'Buttons',
        url: '/admin/ui#buttons',
        section: 'admin-ui'
      },
      {
        label: 'Notifications',
        url: '/admin/ui#notifications',
        section: 'admin-ui'
      },
      {
        label: 'Misc UI',
        url: '/admin/ui#misc-ui',
        section: 'admin-ui',
        items: [
          {
            label: 'Tooltips',
            url: '/admin/ui#tooltips',
            section: 'admin-ui'
          },
          {
            label: 'Dialogs',
            url: '/admin/ui#dialogs',
            section: 'admin-ui'
          },
          {
            label: 'Overlays',
            url: '/admin/ui#overlays',
            section: 'admin-ui'
          },
          {
            label: 'Pagination',
            url: '/admin/ui#pagination',
            section: 'admin-ui'
          }
        ]
      },
      {
        label: 'Debug Mode',
        url: '/admin/ui/debug',
        section: 'admin-ui'
      }
    ]
  }],
  initialize: [
    function (serviceLocator, done) {

      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Admin UI');

      serviceLocator.adminAccessControlList.grant('*', 'Admin UI', 'read');
      done();
    },
    function (serviceLocator, done) {
      // Create controller
      require('./controller')(serviceLocator, __dirname + '/views');
      done();
    }
  ]
};