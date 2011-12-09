var
	formHelper = require('../../lib/utils/formHelper'),
	generic = require('../generic'),
	viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {

	var viewSchema = generic.createViewSchema({
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
					type: 'multiselect',
					createOptions: function(callback) {
						callback(Object.keys(serviceLocator.adminAccessControlList.acl));
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
			var proc = formHelper.processors;
			formHelper.process(req, {
				visible: proc.boolean
			});
			next();
		}
	});
	generic.createRoutes(app, generic.createViewRender('../../admin/views/layout'), viewSchema, serviceLocator.roleModel, null, serviceLocator);
};