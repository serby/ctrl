var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , async = require('async')
  , util = require('util')
  , url = require('url')
  , httpErrors = require('../../../lib/httpErrorHandler')
  , SearchQueryBuilder = require('../../../lib/utils/buildSearchQuery')
  , buildSortOptions = require('../../../lib/utils/buildSortOptions')
  , Pagination = require('../../../lib/utils/pagination');

module.exports.createRoutes = function (app, render, schema, model, serviceLocator, options) {

  var defaults = {
    createValidationSet: '',
    updateValidationSet: '',
    createTag: undefined,
    updateTag: undefined,
    requiredAccess: model.urlName,
    scripts: {}
  };

  options = _.extend(defaults, options);

  var views =  {
    form: __dirname + '/../views/form',
    list: __dirname + '/../views/list',
    view: __dirname + '/../views/view'
  };

  _.extend(views, options.views);

  /*
   * Adds the common JavaScript
   * required for admin section
   */
  function compactMiddleware(view) {
    if (options.scripts[view]) {
      return serviceLocator.compact.js(
        ['admin-common'],
        options.scripts[view]
      );
    } else {
      return serviceLocator.compact.js(['admin-common']);
    }
  }

  /*
   * Returns an access checking middleware
   * based on the required access and the action.
   */
  function accessCheck(action) {
    return serviceLocator.adminAccessControl.requiredAccess(
      options.requiredAccess,
      action,
      '/admin/login'
    );
  }

  /**
  * This ensures errors with properties that are not displayed on the form are shown
  */
  function listUnshownErrors(errors, formType) {

    return Object.keys(errors.errors).filter(function(property) {
      for (var i = 0; i < schema.groups.length; i++) {
        if ((schema.groups[i].properties[property] === undefined) || (!schema.groups[i].properties[property][formType])) {
          return true;
        }
      }
      return false;
    });
  }

  var searchProperties = SearchQueryBuilder.createSearchProperties(schema.groups)
    , buildSearchQuery = SearchQueryBuilder.createSearchQueryBuilder(
        searchProperties,
        serviceLocator.logger,
        model.name
      )
    , paginate = Pagination.createPagination(model.count, 10);

  app.get(
    '/admin/' + model.urlName,
    compactMiddleware('view'),
    buildSearchQuery,
    buildSortOptions,
    paginate,
    accessCheck('read'),
    function (req, res) {

      model.find(
        req.searchQuery,
        _.extend(req.options, req.searchOptions),
        function (errors, dataSet) {
          render(req, res, views.list, {
            viewSchema: schema,
            crudDelegate: model,
            dataSet: dataSet.toArray(),
            page: {
              title: model.name,
              name: model.name,
              section: model.urlName
            },
            url: url.parse(req.url, true).query,
            searchProperties: searchProperties
          });
        }
      );
    }
  );

  // This is the default view schema helpers.
  // Allows for options to be defined in the view schema as an array or a funciton
  // and then use in the presentation of the form.
  function schemaHelper(schema) {
    return function(req, res, next) {
      var fn = [];
      schema.groups.forEach(function(group) {
        Object.keys(group.properties).forEach(function(key) {
          if (typeof group.properties[key].createOptions === 'function') {
            fn.push(function(callback) {
              group.properties[key].createOptions(function(options) {
                group.properties[key].options = options;
                callback();
              });
            });
          }
        });
      });
      async.parallel(fn, function(errors, results) {
        next();
      });
    };
  }

  function isValidationError(error) {
    if (error === null) {
      return false;
    }
    return error.name === 'ValidationError' ? true : false;
  }

  function render500(next) {
    return next('Error saving/updating to database');
  }

  app.get(
    '/admin/' + model.urlName + '/new',
    compactMiddleware('form'),
    accessCheck('create'),
    schemaHelper(schema),
    function (req, res) {

      render(req, res, views.form, {
        viewSchema: schema,
        crudDelegate: model,
        entity: model.entityDelegate.makeDefault(),
        page: {
          title: model.name,
          section: model.urlName,
          action: 'create'
        },
        formType: 'createForm',
        errors: {}
      });

    }
  );

  app.post(
    '/admin/' + model.urlName + '/new',
    compactMiddleware('form'),
    accessCheck('create'),
    serviceLocator.uploadDelegate,
    schema.formPostHelper,
    schemaHelper(schema), function (req, res, next) {

      model.create(
        req.body,
        { validationSet: options.createValidationSet },
        function (errors, newEntity) {
          if (isValidationError(errors)) {
            render(req, res, views.form, {
              viewSchema: schema,
              crudDelegate: model,
              entity: newEntity,
              page: {
                title: model.name,
                section: model.urlName,
                action: 'create'
              },
              formType: 'createForm',
              errors: errors.errors,
              unshownErrors: listUnshownErrors(errors, 'createForm')
            });
          } else if (errors) {
            render500(next);
          } else {
            res.redirect('/admin/' + model.urlName + '/' + newEntity._id);
          }
        }
      );

    }
  );

  app.get(
    '/admin/' + model.urlName + '/:id',
    compactMiddleware('view'),
    accessCheck('read'), function (req, res) {
      model.read(
        req.params.id,
        function (errors, entity) {
          render(req, res, views.view, {
            viewSchema: schema,
            crudDelegate: model,
            entity: entity,
            page: {
              title: model.name,
              section: model.urlName,
              action: 'read'
            }
          });
      });
  });

  app.get(
    '/admin/' + model.urlName + '/:id/edit',
    compactMiddleware('form'),
    schemaHelper(schema),
    accessCheck('update'),
    function (req, res) {
      model.read(req.params.id, function (errors, entity) {

        render(req, res, views.form, {
          viewSchema: schema,
          crudDelegate: model,
          entity: entity,
          page: {
            title: model.name,
            section: model.urlName,
            action: 'update'
          },
          formType: 'updateForm',
          errors: {},
          unshownErrors: []
        });

      });
    }
  );

  app.post(
    '/admin/' + model.urlName + '/:id/edit',
    compactMiddleware('form'),
    serviceLocator.uploadDelegate,
    schema.formPostHelper,
    accessCheck('update'),
    function (req, res, next) {
      model.update(
        req.params.id,
        req.body,
        {
          tag: options.updateTag,
          validationSet: options.updateValidationSet
        },
        function (errors, entity) {
          if (isValidationError(errors)) {
            render(req, res, views.form, {
              viewSchema: schema,
              crudDelegate: model,
              entity: entity,
              page: {
                title: model.name,
                section: model.urlName,
                action: 'update'
              },
              formType: 'updateForm',
              errors: errors.errors,
              unshownErrors: listUnshownErrors(errors, 'updateForm')
            });
          } else if (errors) {
            render500(next);
          } else {
            res.redirect('/admin/' + model.urlName + '/' + entity._id);
          }
        }
      );
    }
  );

  app.get(
    '/admin/' + model.urlName + '/:id/delete',
    accessCheck('delete'),
    function(req, res, next) {
      model['delete'](req.params.id, function(error) {
        if (error !== null) {
          res.send(404);
        } else {
          res.redirect('/admin/' + model.urlName);
        }
      });
    }
  );
};