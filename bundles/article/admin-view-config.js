// Define the how the model properties will be viewed via the generic admin
// interface.

module.exports = function viewConfig(serviceLocator) {

  return serviceLocator.admin.viewConfig({
    groups: [
    {
      name: 'Title',
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
        }
      }
    },
    {
      name: 'Content',
      description: '',
      properties: {
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
        summary: {
          createForm: true,
          updateForm: true,
          view: true,
          searchType: 'text'
        }
      }
    },
    {
      name: 'Images',
      description: 'Images for an Article',
      properties: {
        images: {
          createForm: true,
          updateForm: true,
          view: true,
          type: 'file'
        }
      }
    },
    {
      name: 'Details',
      description: '',
      properties: {
        section: {
          createForm: true,
          updateForm: true,
          list: false,
          view: false
        },
        author: {
          createForm: true,
          updateForm: true,
          list: true,
          view: true,
          searchType: 'text'
        },
        comments: {
          createForm: true,
          updateForm: true,
          view: true,
          type: 'checkbox'
        },
      }
    },
    {
      name: 'Publish',
      description: '',
      properties: {
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
        },
        live: {
          createForm: true,
          updateForm: true,
          list: true,
          view: true,
          type: 'checkbox'
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