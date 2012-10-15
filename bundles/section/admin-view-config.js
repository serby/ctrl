// Define the how the model properties will be viewed via the generic admin
// interface.

module.exports = function(serviceLocator) {

  return serviceLocator.admin.viewConfig({
    // Properties can be grouped into sections.
    groups: [{
      // Sections will display the 'name'
      // and 'description' on the form and view page.
      name: 'Section Details',
      description: 'These are the details for a Section',
      properties: {
        _id: {
          // Show on the create and edit form
          updateForm: true,
          // The input type on the form
          type: 'hidden'
        },
        name: {
          // Show on the list page
          list: true,
          // Show on view page
          view: true,
          // Show on create form
          createForm: true,
          // Show on create form
          updateForm: true,
          // Can be search as text via the search box
          searchType: 'text',
          // Show the required indicator
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
    // The generic admin route will process the for data through this function
    // Before passing it to the model.
    formPostHelper: function(req, res, next) {
      next();
    }
  });
};