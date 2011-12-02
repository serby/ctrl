var
	formHelper = require('../../lib/utils/formHelper'),
	generic = require('../generic'),
	viewRenderDelegate = require('../../lib/viewRenderDelegate');

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
				updateForm: true
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

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {
	generic.createRoutes(app, generic.createViewRender('../../admin/views/layout'), viewSchema, serviceLocator.roleModel, null, serviceLocator);
};