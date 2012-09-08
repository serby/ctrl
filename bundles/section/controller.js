var
  _ = require('lodash'),
  viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {

  var viewSchema = serviceLocator.generic.createViewSchema({
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

  serviceLocator.generic.createRoutes(
    serviceLocator,
    viewSchema,
    serviceLocator.sectionModel,
    {
      requiredAccess: 'Section',
      renderFn: serviceLocator.generic.createViewRender('../../admin/views/layout')
    }
  );
};