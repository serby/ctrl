var
	_ = require('underscore'),
	formHelper = require('../../lib/utils/formHelper'),
	generic = require('../generic'),
	viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {

	var viewSchema = generic.createViewSchema({
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
					view: true,
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
							callback(_.pluck(roles.toArray(), 'name'));
						});
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

			next();
		}
	});

	generic.createRoutes(
		app,
		generic.createViewRender('../../admin/views/layout'),
		viewSchema,
		serviceLocator.administratorModel,
		serviceLocator,
		{
			updateTag: 'update',
			requiredAccess: 'Administrator'
		}
	);
};