var
  _ = require('underscore'),
  generic = require('../generic'),
  viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {

  var viewSchema = generic.createViewSchema({
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

  generic.createRoutes(
    app,
    generic.createViewRender('../../admin/views/layout'),
    viewSchema,
    serviceLocator.sectionModel,
    serviceLocator,
    {
      requiredAccess: 'Section'
    }
  );
};