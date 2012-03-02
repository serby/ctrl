var
	_ = require('underscore'),
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	util = require('util'),
	url = require('url'),
	httpErrors = require('../../../lib/httpErrorHandler'),
	SearchQueryBuilder = require('../../../lib/utils/buildSearchQuery'),
	buildSortOptions = require('../../../lib/utils/buildSortOptions'),
	Pagination = require('../../../lib/utils/pagination');

module.exports.createRoutes = function (app, viewRender, adminViewSchema, crudDelegate, serviceLocator, customOptions) {

	var options = {
		createValidationSet: '',
		updateValidationSet: '',
		createTag: undefined,
		updateTag: undefined,
		requiredAccess: crudDelegate.urlName
	};

	_.extend(options, customOptions);

	/**
	* This ensures errors with properties that are not displayed on the form are showen
	*/
	function listUnshownErrors(errors, formType) {

		return Object.keys(errors.errors).filter(function(property) {
			for (var i = 0; i < adminViewSchema.groups.length; i++) {
				if ((adminViewSchema.groups[i].properties[property] === undefined) || (!adminViewSchema.groups[i].properties[property][formType])) {
					return true;
				}
			}
			return false;
		});
	}

	var
		searchProperties = SearchQueryBuilder.createSearchProperties(adminViewSchema.groups),
		buildSearchQuery = SearchQueryBuilder.createSearchQueryBuilder(searchProperties, serviceLocator.logger, crudDelegate.name),
		paginate = Pagination.createPagination(crudDelegate.count, 10);

	app.get('/admin/' + crudDelegate.urlName, buildSearchQuery, buildSortOptions, paginate,
		serviceLocator.adminAccessControl.requiredAccess(options.requiredAccess, 'read'), function (req, res) {

		crudDelegate.find(req.query, _.extend(req.options, req.searchOptions), function (errors, dataSet) {
			viewRender(req, res, 'list', {
				viewSchema: adminViewSchema,
				crudDelegate: crudDelegate,
				dataSet: dataSet.toArray(),
				page: {
					title: crudDelegate.name,
					name: crudDelegate.name,
					section: crudDelegate.urlName
				},
				url: url.parse(req.url, true).query,
				searchProperties: searchProperties
			});
		});
	});

	// This is the default view schema helpers.
	// Allows for options to be defined in the view schema as an array or a funciton
	// and then use in the presentation of the form.
	function adminViewSchemaHelper(adminViewSchema) {
		return function(req, res, next) {
			var fn = [];
			adminViewSchema.groups.forEach(function(group) {
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

	app.get('/admin/' + crudDelegate.urlName + '/new',
		serviceLocator.adminAccessControl.requiredAccess(options.requiredAccess, 'create'),
		adminViewSchemaHelper(adminViewSchema), function (req, res) {

		viewRender(req, res, 'form', {
			viewSchema: adminViewSchema,
			crudDelegate: crudDelegate,
			entity: crudDelegate.entityDelegate.makeDefault(),
			page: {
				title: crudDelegate.name,
				section: crudDelegate.urlName,
				action: 'create'
			},
			formType: 'createForm',
			errors: {}
		});
	});

	app.post('/admin/' + crudDelegate.urlName + '/new',
		serviceLocator.adminAccessControl.requiredAccess(options.requiredAccess, 'create'),
		serviceLocator.uploadDelegate,
		adminViewSchema.formPostHelper,
		adminViewSchemaHelper(adminViewSchema), function (req, res, next) {

		crudDelegate.create(req.body, { validationSet: options.createValidationSet }, function (errors, newEntity) {
			if (isValidationError(errors)) {
				viewRender(req, res, 'form', {
					viewSchema: adminViewSchema,
					crudDelegate: crudDelegate,
					entity: newEntity,
					page: {
						title: crudDelegate.name,
						section: crudDelegate.urlName,
						action: 'create'
					},
					formType: 'createForm',
					errors: errors.errors,
					unshownErrors: listUnshownErrors(errors, 'createForm')
				});
			} else if (errors) {
				render500(next);
			} else {
				res.redirect('/admin/' + crudDelegate.urlName + '/' + newEntity._id);
			}
		});
	});

	app.get('/admin/' + crudDelegate.urlName + '/:id', serviceLocator.adminAccessControl.requiredAccess(options.requiredAccess, 'read'), function (req, res) {
		crudDelegate.read(req.params.id, function (errors, entity) {
			viewRender(req, res, 'view', {
				viewSchema: adminViewSchema,
				crudDelegate: crudDelegate,
				entity: entity,
				page: {
					title: crudDelegate.name,
					section: crudDelegate.urlName,
					action: 'read'
				}
			});
		});
	});

	app.get('/admin/' + crudDelegate.urlName + '/:id/edit', adminViewSchemaHelper(adminViewSchema), serviceLocator.adminAccessControl.requiredAccess(options.requiredAccess, 'update'), function (req, res) {
		crudDelegate.read(req.params.id, function (errors, entity) {

			viewRender(req, res, 'form', {
				viewSchema: adminViewSchema,
				crudDelegate: crudDelegate,
				entity: entity,
				page: {
					title: crudDelegate.name,
					section: crudDelegate.urlName,
					action: 'update'
				},
				formType: 'updateForm',
				errors: {},
				unshownErrors: []
			});
		});
	});

	app.post('/admin/' + crudDelegate.urlName + '/:id/edit', serviceLocator.uploadDelegate,
		adminViewSchema.formPostHelper, serviceLocator.adminAccessControl.requiredAccess(options.requiredAccess, 'update'), function (req, res, next) {
		crudDelegate.update(req.params.id, req.body, { tag: options.updateTag, validationSet: options.updateValidationSet }, function (errors, entity) {
			if (isValidationError(errors)) {
				viewRender(req, res, 'form', {
					viewSchema: adminViewSchema,
					crudDelegate: crudDelegate,
					entity: entity,
					page: {
						title: crudDelegate.name,
						section: crudDelegate.urlName,
						action: 'update'
					},
					formType: 'updateForm',
					errors: errors.errors,
					unshownErrors: listUnshownErrors(errors, 'updateForm')
				});
			} else if (errors) {
				render500(next);
			} else {
				res.redirect('/admin/' + crudDelegate.urlName + '/' + entity._id);
			}
		});
	});

	app.get('/admin/' + crudDelegate.urlName + '/:id/delete', serviceLocator.adminAccessControl.requiredAccess(options.requiredAccess, 'delete'), function(req, res, next) {
		crudDelegate['delete'](req.params.id, function(error) {
			if (error !== null) {
				res.send(404);
			} else {
				res.redirect('/admin/' + crudDelegate.urlName);
			}
		});
	});
};