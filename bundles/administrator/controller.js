var
	formHelper = require('../../lib/utils/formHelper'),
	generic = require('../../lib/generic'),
	viewRenderDelegate = require('../../lib/viewRenderDelegate');

var viewSchema = generic.createViewSchema({
	groups: [{
		name: 'Administrator Details',
		description: 'These are the details for an administrator',
		properties: {
			emailAddress: {
				list: true,
				view: true,
				form: true
			},
			_id: {
				form: true,
				type: 'hidden'
			},
			firstName: {
				list: true,
				view: true,
				form: false,
				searchField: 'text'
			},
			lastName: {
				list: true,
				view: true,
				form: true,
				searchField: 'text'
			},
			password: {
				list: false,
				view: true,
				form: true
			},
			roles: {
				list: false,
				view: true,
				form: true
			},
			created: {
				list: true,
				view: true,
				form: false,
				format: function(value) {
					if (value) {
						return (new Date(value)).format('dS mmm, yyyy');
					}
				}
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
	var viewRender = viewRenderDelegate.create('admin/generic');
	generic.createRoutes(app, viewRender, viewSchema, serviceLocator.administratorModel, null, serviceLocator);
};