module.exports = function versionStatic(path) {
	return function(res, req, next) {
		if (req.method !== 'GET') {
			return next();
		}

		url = parse(req.url);
		filename = path.join(dirPath, url.pathname);

	};
};
