var
	genericAdminViewSchema = require('../lib/genericAdminViewSchema'),
	should = require('should');

describe('genericAdminViewSchema', function () {
	describe('#createViewSchema()', function () {
		it('should not select a hidden field as the object\'s title field', function () {
			var schema = {
				groups: [{
					name: 'Test',
					description: 'This schema is a subset of what appears in the administrator bundle',
					properties: {
						_id: {type: 'hidden', view: true} 
					}
				}]
			};

			(function(){
				genericAdminViewSchema.createViewSchema(schema);
			}).should.throw();
		});

		it('should not select a password field as the object\'s title field', function () {
			var schema = {
				groups: [{
					name: 'Test',
					description: 'This schema is a subset of what appears in the administrator bundle',
					properties: {
						password: {type: 'password', view: true} 
					}
				}]
			};

			(function(){
				genericAdminViewSchema.createViewSchema(schema);
			}).should.throw();
		});

		it('should not select a field with view marked false as the object\'s title field', function () {
			var schema = {
				groups: [{
					name: 'Test',
					description: 'This schema is a subset of what appears in the administrator bundle',
					properties: {
						middleInitial: {view: false} 
					}
				}]
			};

			(function(){
				genericAdminViewSchema.createViewSchema(schema);
			}).should.throw();
		});

		it('should select the first field with no type and view marked true as the object\'s title field', function () {
			var schema = {
				groups: [{
					name: 'Test',
					description: 'This schema is a subset of what appears in the administrator bundle',
					properties: {
						firstName: {view: true},
						lastName: {view: true}
					}
				}]
			};
			genericAdminViewSchema.createViewSchema(schema).title.should.equal('firstName');
		});

		it('should not override the title if the user has provided one', function () {
			var schema = {
				groups: [{
					name: 'Test',
					description: 'This schema is a subset of what appears in the administrator bundle',
					properties: {
						firstName: {},
						middleInitial: {},
						lastName: {}
					}
				}],
				title: 'lastName'
			};
			genericAdminViewSchema.createViewSchema(schema).title.should.equal('lastName');
		});

	});
});
