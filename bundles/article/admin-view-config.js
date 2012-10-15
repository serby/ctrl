// Define the how the model properties will be viewed via the generic admin
// interface.

module.exports = function viewConfig(serviceLocator) {

  return serviceLocator.admin.viewConfig({
    groups: [{
      name: 'Article Details',
      description: 'These are the details for an Article',
      properties: {
        _id: {
          // Show on the create and edit form
          updateForm: true,
          // The input type on the form
          type: 'hidden'
        },
        title: {
          createForm: true,
          list: true,
          view: true,
          searchType: 'text'
        },
        section: {
          createForm: true,
          list: true,
          view: false
        },
        slug: {
          createForm: true,
          list: false,
          view: false,
          searchType: 'text'
        },
        path: {
          createForm: false,
          list: false,
          view: true,
          type: 'link'
        },
        summary: {
          createForm: true,
          view: true,
          searchType: 'text'
        },
        author: {
          createForm: true,
          list: true,
          view: true,
          searchType: 'text'
        },
       type: {
         createForm: true,
         list: true,
         view: true
       },
        body: {
          createForm: true,
          list: true,
          view: true
        },
        live: {
          createForm: true,
          list: true,
          view: true,
          type: 'checkbox'
        },
        comments: {
          createForm: true,
          view: true,
          type: 'checkbox'
        },
        created: {
          createForm: true,
          list: false,
          view: true,
          type: 'dateTime'
        },
        publishedDate: {
          createForm: true,
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
          view: false
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
    formPostHelper: function(req, res, next) {

      var proc = serviceLocator.admin.formHelper

      proc(req, {
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