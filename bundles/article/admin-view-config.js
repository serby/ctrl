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
          updateForm: true,
          list: true,
          view: true,
          searchType: 'text'
        },
        section: {
          createForm: true,
          updateForm: true,
          list: false,
          view: false
        },
        slug: {
          createForm: true,
          updateForm: true,
          list: false,
          view: false,
          searchType: 'text'
        },
        path: {
          createForm: false,
          updateForm: true,
          list: true,
          view: true,
          type: 'link'
        },
        summary: {
          createForm: true,
          updateForm: true,
          view: true,
          searchType: 'text'
        },
        author: {
          createForm: true,
          updateForm: true,
          list: true,
          view: true,
          searchType: 'text'
        },
       type: {
         createForm: true,
         updateForm: true,
         list: true,
         view: true
       },
        body: {
          createForm: true,
          updateForm: true,
          list: false,
          view: true
        },
        live: {
          createForm: true,
          updateForm: true,
          list: true,
          view: true,
          type: 'checkbox'
        },
        comments: {
          createForm: true,
          updateForm: true,
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
          updateForm: true,
          list: true,
          view: true,
          edit: true,
          type: 'dateTime'
        }
      }
    },
    {
      name: 'Article Images',
      description: 'Images for an Article',
      properties: {
        images: {
          createForm: true,
          updateForm: true,
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