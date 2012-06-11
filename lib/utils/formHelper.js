module.exports.processors = {
	split: function(key, form) {
		if ((form[key] !== undefined) && (typeof form[key] === 'string')) {
			form[key] = form[key].split(',').map(function(item) {
				return item.trim();
			});
			return form[key];
		}
	},
	defaultValue: function(value) {
		return function(key, form) {
			if (form[key] === undefined) {
				form[key] = value;
			}
		};
	},
	boolean: function(key, form) {
		form[key] = (form[key] === undefined) ? false : true;
	},
	date: function(key, form) {
		if (form[key] !== undefined) {
			form[key] = new Date(form[key]);
		} else {
			form[key] = undefined;
		}
	},
	nullOrDate: function(key, form) {
		if (form[key] === undefined) {
			form[key] = new Date();
		} else {
			form[key] = null;
		}
	},
	file: function(key, form) {
		var hiddenFile = 'current-' + key;
		if (typeof form[hiddenFile] === 'string' && typeof form[key] === 'undefined') {
			form[key] = JSON.parse(form[hiddenFile]);
		} else if (typeof form[hiddenFile] === 'string' && Array.isArray(form[key])) {
			form[key] = form[key].concat(JSON.parse(form[hiddenFile]));
		}
	},
	removeImage: function(imageFields) {
		return function(key, form) {
			if (typeof form[key] !== 'undefined') {
				imageFields.forEach(function(imageField) {
					if (typeof form[imageField] !== 'undefined') {
						form[imageField].forEach(function(image) {
							form[key].forEach(function(imageHash) {
								if (imageHash === image.path) {
									delete form[imageField][form[imageField].indexOf(image)];
								}
							});
						});
					}
				});
			}
			imageFields.forEach(function(imageField) {
				if (typeof form[imageField] !== 'undefined') {
					var strippedArray = [];
					form[imageField].forEach(function(image) {
						if (image) {
							strippedArray.push(image);
						}
					});
					form[imageField] = strippedArray;
				}
			});
		};
	}
};

module.exports.process = function(req, formMeta) {
	Object.keys(formMeta).forEach(function(key) {
		formMeta[key](key, req.body);
	});
};
