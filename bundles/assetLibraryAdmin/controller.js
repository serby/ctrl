var viewRenderDelegate = require('../../lib/viewRenderDelegate'),
    generic = require('../generic');

function createRoutes(app, properties, serviceLocator, viewPath) {

  var viewRender = viewRenderDelegate.create(viewPath)
    , compact = serviceLocator.compact;

  var viewSchema = generic.createViewSchema({
    groups: [{
      name: 'Article Details',
      description: 'These are the details for an Article',
      properties: {
        title: {
          list: true,
          view: true,
          searchType: 'text'
        }
      }
    }],
    title: 'title'
  });

  generic.createRoutes(
    app,
    generic.createViewRender('../../admin/views/layout'),
    viewSchema,
    serviceLocator.assetLibrary,
    serviceLocator,
    {
      requiredAccess: 'Article'
    }
  );

}

module.exports.createRoutes = createRoutes;