module.exports = function createRoutes (serivceLocator, bundleViewPath) {
  var viewRender = serivceLocator.viewRender(bundleViewPath);

  serivceLocator.app.get('/', function(req, res) {
    viewRender(req, res, 'index', {
      page: {
        layoutType: 'feature',
        title: 'Home ',
        section: 'home'
      },
      javascriptSrc: []
    });
  });

};