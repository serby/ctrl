var
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	util = require('util'),
	url = require('url');

module.exports.createRoutes = function (app, viewRender, adminViewSchema, crudDelegate, dataPath, serviceLocator) {

	/**
	* Creates an object of the searchable fields in the schema. Used by the mongo query builder later on.
	* Iterates through each group and the properties of that group to get the searchField and the type of data
	*/
	var searchFields = {};
	Object.keys(adminViewSchema.groups).forEach(function(group) {
		Object.keys(adminViewSchema.groups[group].properties).forEach(function(property) {
			if (adminViewSchema.groups[group].properties[property].searchField) {
				searchFields[property] = adminViewSchema.groups[group].properties[property].searchField;
			}
		});
	});

	/**
	* This ensures errors with properties that are not displayed on the form are showen
	*/
	function listUnshownErrors(errors, formType) {

		return Object.keys(errors).filter(function(property) {
			for (var i = 0; i < adminViewSchema.groups.length; i++) {
				if ((adminViewSchema.groups[i].properties[property] === undefined) || (!adminViewSchema.groups[i].properties[property][formType])) {
					return true;
				}
			}
			return false;
		});
	}

	function uploadDelegate(req, res, next) {

		async.forEach(Object.keys(req.body), function(key, eachCallback) {

			var
				formValue = req.body[key];

			if (formValue.path === undefined) {
				return eachCallback();
			}

			var hash = path.basename(file.path);

			fs.mkdir(dataPath + '/' + hash, '0755', function(error) {
				serviceLocator.logger.info('Copying %s to %s', file.path, destPath);

				var
					destPath = path.normalize(dataPath + '/' + hash + '/' + formValue.name),
					readFile = fs.createReadStream(formValue.path),
					writeFile = fs.createWriteStream(destPath, { flags: 'w' });

				readFile.pipe(writeFile);
				readFile.on('end', function() {
					req.body[key] = {
						size: formValue.size,
						type: formValue.type,
						path: hash + '/',
						basename: formValue.name
					};
					eachCallback();
				});
			});
		}, function(error) {
			if (error) {
				next(error);
			} else {
				next();
			}
		});
	}

	function buildSearchQuery(urlObj) {
		var
			query = {},
			queryItem = {},
			queryFields = [],
			filter = urlObj.Filter,
			regExpSearchTerm;

		if (Object.keys(searchFields).length === 0) {
			console.error('No search fields set up for ' + crudDelegate.name);
			return query;
		}

		if (filter) {
			Object.keys(searchFields).forEach(function(field) {
				queryItem = {};
				switch (searchFields[field]) {
					case 'number':
						if(!isNaN(+filter)) {
							queryItem[field] = +filter;
							queryFields.push(queryItem);
						}
						break;
					case 'text':
						regExpSearchTerm = new RegExp (filter, '/i');
						queryItem[field] = regExpSearchTerm;
						queryFields.push(queryItem);
						break;
				}
			});

			query = { $or: queryFields };
		}

		if (Object.keys(query).length > 0) {
			console.info(crudDelegate.name, 'search query: ', query);
		}

		return query;
	}

	app.get('/admin/' + crudDelegate.urlName,
		serviceLocator.adminAccessControl.requiredAccess(crudDelegate.urlName, 'read'), function (req, res) {

		var
			urlObj = url.parse(req.url, true).query,
			mongoQuery = {};

		mongoQuery = buildSearchQuery(urlObj);

		crudDelegate.find(mongoQuery, {}, function (errors, dataSet) {
			viewRender(req, res, 'list', {
				viewSchema: adminViewSchema,
				crudDelegate: crudDelegate,
				dataSet: dataSet.toArray(),
				page: {
					title: crudDelegate.name,
					name: crudDelegate.name,
					section: crudDelegate.urlName
				},
				url: urlObj
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

	app.get('/admin/' + crudDelegate.urlName + '/new',
		serviceLocator.adminAccessControl.requiredAccess(crudDelegate.urlName, 'create'),
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
		serviceLocator.adminAccessControl.requiredAccess(crudDelegate.urlName, 'create'),
		adminViewSchema.formPostHelper,
		uploadDelegate,
		adminViewSchemaHelper(adminViewSchema), function (req, res) {

		crudDelegate.create(req.body, {}, function (errors, newEntity) {
			if (errors) {
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
					errors: errors,
					unshownErrors: listUnshownErrors(errors, 'createForm')
				});
			} else {
				res.redirect('/admin/' + crudDelegate.urlName + '/' + newEntity._id);
			}
		});
	});

	app.get('/admin/' + crudDelegate.urlName + '/:id', serviceLocator.adminAccessControl.requiredAccess(crudDelegate.urlName, 'read'), function (req, res) {
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

	app.get('/admin/' + crudDelegate.urlName + '/:id/edit', adminViewSchemaHelper(adminViewSchema), serviceLocator.adminAccessControl.requiredAccess(crudDelegate.urlName, 'update'), function (req, res) {
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

	app.post('/admin/' + crudDelegate.urlName + '/:id/edit', uploadDelegate, adminViewSchema.formPostHelper, serviceLocator.adminAccessControl.requiredAccess(crudDelegate.urlName, 'update'), function (req, res) {
		crudDelegate.update(req.params.id, req.body, {}, function (errors, entity) {
			if (errors) {
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
					errors: errors,
					unshownErrors: listUnshownErrors(errors, 'updateForm')
				});
			} else {
				res.redirect('/admin/' + crudDelegate.urlName + '/' + entity._id);
			}
		});
	});

	app.get('/admin/' + crudDelegate.urlName + '/:id/delete', serviceLocator.adminAccessControl.requiredAccess(crudDelegate.urlName, 'delete'), function(req, res, next) {
		crudDelegate['delete'](req.params.id, function(error) {
			if (error !== null) {
				res.send(404);
			} else {
				res.redirect('/admin/' + crudDelegate.urlName);
			}
		});
	});
};