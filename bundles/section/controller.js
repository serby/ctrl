module.exports = function createRoutes (serviceLocator, bundleViewPath) {

  var viewSchema = require('ctrl-generic/view-config')({
    groups: [{
      name: 'Section Details',
      description: 'These are the details for a Section',
      properties: {
        _id: {
          form: true,
          type: 'hidden'
        },
        name: {
          list: true,
          view: true,
          createForm: true,
          updateForm: true,
          searchType: 'text',
          required: true
        },
        slug: {
          list: true,
          view: true,
          createForm: true,
          updateForm: true,
          searchType: 'text',
          required: true
        },
        created: {
          list: true,
          view: true,
          createForm: false,
          type: 'dateTime'
        }
      }
    }],
    title: 'name',
    formPostHelper: function(req, res, next) {
      next();
    }
  });

  require('ctrl-generic/routes')(
    serviceLocator,
    viewSchema,
    serviceLocator.sectionModel,
    {
      requiredAccess: 'Section',
      renderFn: require('ctrl-generic/view-render')('../../admin/views/layout')
    }
  );
};