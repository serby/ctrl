// Define the how the model properties will be viewed via the generic admin
// interface.

var formHelper = require('../../lib/form-helper')

module.exports = function(serviceLocator) {

  return serviceLocator.admin.viewConfig({
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
          view: false
        },
        slug: {
          list: false,
          view: false,
          searchType: 'text'
        },
        path: {
          list: false,
          view: true,
          type: 'link'
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
};