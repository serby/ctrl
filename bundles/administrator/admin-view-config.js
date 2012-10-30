var _ = require('lodash')


module.exports = function(serviceLocator) {
  return serviceLocator.admin.viewConfig({
    groups: [{
      name: 'Administrator Details',
      description: 'These are the details for an administrator',
      properties: {
        emailAddress: {
          list: true,
          view: true,
          createForm: true,
          updateForm: true,
          required: true
        },
        _id: {
          updateForm: true,
          type: 'hidden'
        },
        firstName: {
          list: true,
          view: true,
          createForm: true,
          updateForm: true,
          searchType: 'text',
          required: true
        },
        lastName: {
          list: true,
          view: true,
          createForm: true,
          updateForm: true,
          searchType: 'text',
          required: true
        },
        password: {
          list: false,
          createForm: true,
          updateForm: false,
          view: false,
          type: 'password',
          required: true
        },
        roles: {
          list: false,
          view: true,
          createForm: true,
          updateForm: true,
          type: 'multiselect',
          createOptions: function(callback) {
            serviceLocator.roleModel.find({}, {}, function(error, roles) {
              if (error) {
                return callback(error)
              } else {
                callback(null, _.pluck(roles, 'name'))
              }
            })
          }
        },
        created: {
          list: true,
          view: true,
          createForm: false,
          type: 'dateTime'
        }
      }
    }],
    formPostHelper: function(req, res, next) {
      next()
    }
  })
}