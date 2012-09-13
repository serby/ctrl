var
  async = require('async'),
  _ = require('lodash');

module.exports.createRoutes = function (app, viewRender, adminViewSchema, crudDelegate, serviceLocator, customOptions) {

  var options = {
    createValidationSet: '',
    updateValidationSet: '',
    createTag: undefined,
    updateTag: undefined,
    requiredAccess: crudDelegate.slug
  }
  , compact = serviceLocator.compact;

  _.extend(options, customOptions);

  function getDropdownOptions(req, res, next) {

    res.local('typesDropdown', ['Markdown', 'HTML']);
    res.local('currentAdmin', {
      author: req.session.admin.firstName + ' ' + req.session.admin.lastName
    });

    async.parallel({
      sections: function(callback) {
        serviceLocator.sectionModel.find({}, {}, function(error, sections) {
          var sectionsDropdownObject = {};
          sectionsDropdownObject[''] = '';
          sections.forEach(function(section) {
            sectionsDropdownObject[section.name] = section.slug;
          });
          res.local('sectionsDropdown', sectionsDropdownObject);
          callback();
        });
      },
      authors: function(callback) {
        serviceLocator.administratorModel.find({}, { sort: { lastName: 1 } },
          function(error, admins) {

          var adminsDropdown = [];
          adminsDropdown.push('');
          admins.forEach(function(admin) {
            adminsDropdown.push(admin.firstName + ' ' + admin.lastName);
          });
          res.local('adminsDropdown', adminsDropdown);
          callback();
        });
      }
    }, function() {
      next();
    });
  }

  app.get(
    '/admin/' + crudDelegate.slug + '/new',
    serviceLocator.adminAccessControl.requiredAccess(options.requiredAccess, 'create'),
    compact.js(
      ['global'],
      ['admin'],
      ['article-admin', 'markdown-editor']
    ),
    getDropdownOptions, function (req, res) {

    viewRender(req, res, 'adminForm', {
      model: crudDelegate,
      entity: crudDelegate.entityDelegate.makeDefault(),
      page: {
        title: crudDelegate.name,
        section: crudDelegate.slug,
        action: 'create'
      },
      formType: 'createForm',
      errors: {}
    });
  });

  app.post(
    '/admin/' + crudDelegate.slug + '/new',
    compact.js(
      ['global'],
      ['admin'],
      ['article-admin', 'markdown-editor']
    ),
    serviceLocator.adminAccessControl.requiredAccess(options.requiredAccess, 'create'),
    serviceLocator.uploadDelegate.middleware,
    adminViewSchema.formPostHelper,
    getDropdownOptions,
    function (req, res, next) {

    crudDelegate.create(req.body, { validationSet: options.createValidationSet },
    function (errors, newEntity) {

      if (errors) {
        viewRender(req, res, 'adminForm', {
          viewSchema: adminViewSchema,
          model: crudDelegate,
          entity: newEntity,
          page: {
            title: crudDelegate.name,
            section: crudDelegate.slug,
            action: 'create'
          },
          formType: 'createForm',
          errors: errors.errors
        });
      } else {
        res.redirect('/admin/' + crudDelegate.slug + '/' + newEntity._id);
      }
    });
  });

  app.get(
    '/admin/' + crudDelegate.slug + '/:id/edit',
    compact.js(
      ['global'],
      ['admin'],
      ['article-admin', 'markdown-editor']
    ),
    serviceLocator.adminAccessControl.requiredAccess(options.requiredAccess, 'update'),
    getDropdownOptions,
    function (req, res) {

    crudDelegate.read(req.params.id, function (errors, entity) {

      viewRender(req, res, 'adminForm', {
        viewSchema: adminViewSchema,
        model: crudDelegate,
        entity: entity,
        page: {
          title: crudDelegate.name,
          section: crudDelegate.slug,
          action: 'update'
        },
        formType: 'updateForm',
        errors: {}
      });
    });
  });

  app.post(
    '/admin/' + crudDelegate.slug + '/:id/edit',
    compact.js(
      ['global'],
      ['admin'],
      ['article-admin', 'markdown-editor']
    ),
    serviceLocator.uploadDelegate.middleware,
    adminViewSchema.formPostHelper,
    serviceLocator.adminAccessControl.requiredAccess(options.requiredAccess, 'update'),
    getDropdownOptions,
    function (req, res, next) {

    crudDelegate.update(req.params.id, req.body, { tag: options.updateTag, validationSet: options.updateValidationSet }, function (errors, entity) {
      if (errors) {
        viewRender(req, res, 'adminForm', {
          viewSchema: adminViewSchema,
          model: crudDelegate,
          entity: entity,
          page: {
            title: crudDelegate.name,
            section: crudDelegate.slug,
            action: 'update'
          },
          formType: 'updateForm',
          errors: errors.errors
        });
      } else {
        res.redirect('/admin/' + crudDelegate.slug + '/' + entity._id);
      }
    });
  });

};