var
  formHelper = require('../../lib/utils/formHelper'),
  viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {

  var viewSchema = serviceLocator.generic.createViewSchema({
    groups: [{
      name: 'Role Details',
      description: 'These are the details for a role',
      properties: {
        name: {
          list: true,
          view: true,
          createForm: true,
          updateForm: true
        },
        _id: {
          form: true,
          type: 'hidden'
        },
        grants: {
          list: true,
          view: true,
          createForm: true,
          updateForm: true,
          type: 'groupedMultiselect',
          createOptions: function(callback) {
            var options = [];
            Object.keys(serviceLocator.adminAccessControlList.acl).forEach(function(value) {
              var aclItem = serviceLocator.adminAccessControlList.acl[value];
              var option = {
                label: value,
                value: value,
                description: aclItem.description,
                items: Object.keys(aclItem.actions)
              };
              options.push(option);
            });
            callback(options);
          }
        },
        created: {
          list: true,
          view: true,
          type: 'dateTime'
        }
      }
    }],
    formPostHelper: function(req, res, next) {
      var newGrants = {};

      if (typeof req.body.grants !== 'undefined' && Object.keys(req.body.grants).length !== 0) {
        Object.keys(req.body.grants).forEach(function(grant) {
          newGrants[grant] = Array.isArray(req.body.grants[grant]) ? req.body.grants[grant] : [req.body.grants[grant]];
        });
        req.body.grants = newGrants;
      }

      next();
    }
  });
  serviceLocator.generic.createRoutes(
    serviceLocator,
    viewSchema,
    serviceLocator.roleModel,
    {
      requiredAccess: 'Role',
      renderFn: serviceLocator.generic.createViewRender('../../admin/views/layout')
    }
  );
};