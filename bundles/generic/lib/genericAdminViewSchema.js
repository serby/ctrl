module.exports.createViewSchema = function(schema) {

	schema.groups.forEach(function(group) {
		Object.keys(group.properties).forEach(function(key) {
			if (group.properties[key].format === undefined) {
				group.properties[key].format = function(value) { return value; };
			}
		});
	});
	// Ensure that this schema has a valid title property to display.
	if ((schema.title === undefined) || (schema.groups[0].properties[schema.title] === undefined)) {
		Object.keys(schema.groups[0].properties).forEach(function (key) {
			if (schema.title === undefined) {
				var property = schema.groups[0].properties[key];
				if (property.type !== 'hidden' && property.view === true) {
					schema.title = key;
				}
			}
		});
		if (schema.title === undefined) {
			throw new Error(schema.groups[0].name + " view schema has no properties which can be used as the object title");
		}
	}
	return schema;
};
