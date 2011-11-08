module.exports.createViewSchema = function(schema) {

	schema.groups.forEach(function(group) {
		Object.keys(group.properties).forEach(function(key) {
			if (group.properties[key].format === undefined) {
				group.properties[key].format = function(value) { return value; };
			}
		});
	});
	// Ensure that this schema has a valid title property to display.
	//TODO: This should look for the first property that is visible in all views.
	if ((schema.title === undefined) || (schema.groups[0].properties[schema.title] === undefined)) {
		schema.title = Object.keys(schema.groups[0].properties)[0];
	}
	return schema;
};