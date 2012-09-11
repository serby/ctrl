module.exports = function(bundlePath) {
  return function(req, res, view, properties) {
    var viewPath = bundlePath + '/' + view;
    res.render(viewPath, properties);
  };
};