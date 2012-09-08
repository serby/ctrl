var
  _ = require('lodash'),
  formHelper = require('../../lib/utils/formHelper'),
  generic = require('../generic'),
  adminController = require('./adminController'),
  viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {

  var viewSchema = serviceLocator.generic.createViewSchema({
    groups: [{
      name: 'Article Details',
      description: 'These are the details for an Article',
      properties: {
        title: {
          list: true,
          view: true,
          searchType: 'text'
        },
        section: {
          list: true,
          view: true
        },
        slug: {
          list: false,
          view: true,
          searchType: 'text'
        },
        summary: {
          view: true,
          searchType: 'text'
        },
        author: {
          list: true,
          view: true,
          searchType: 'text'
        },
        live: {
          list: true,
          view: true
        },
        comments: {
          view: true
        },
        created: {
          list: false,
          view: true,
          type: 'dateTime'
        },
        publishedDate: {
          list: true,
          view: true,
          edit: true,
          type: 'dateTime'
        }
      }
    },
    {
      name: 'Article Content',
      description: 'This is the content for an Article',
      properties: {
        type: {
          view: true
        },
        body: {
          view: true
        }
      }
    },
    {
      name: 'Article Images',
      description: 'Images for an Article',
      properties: {
        images: {
          view: true,
          type: 'file'
        }
      }
    }],
    title: 'title',
    formPostHelper: function(req, res, next) {
      var proc = formHelper.processors;

      formHelper.process(req, {
        images: proc.file,
        live: proc.boolean,
        comments: proc.boolean,
        publishedDate: proc.date,
        removeImage: proc.removeImage(['images'])
      });

      next();
    }
  });

  var articleViewRender = viewRenderDelegate.create(__dirname + '/views');

  // These routes are here to override the default generic form
  adminController.createRoutes(
    app,
    articleViewRender,
    viewSchema,
    serviceLocator.articleModel,
    serviceLocator,
    {
      requiredAccess: 'Article'
    }
  );

  serviceLocator.generic.createRoutes(
    serviceLocator,
    viewSchema,
    serviceLocator.articleModel,
    {
      requiredAccess: 'Article',
      renderFn: serviceLocator.generic.createViewRender('../../admin/views/layout')
    }
  );
};