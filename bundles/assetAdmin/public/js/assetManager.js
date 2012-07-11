(function () {

  var AssetManagerView = require('AssetManagerView')
    , AssetManagerModel = require('AssetManagerModel')
    , AssetItemView = require('AssetItemView')
    , PaginatedCollection = require('PaginatedCollection')
    , PaginationView = require('PaginationView')
    , notification = require('notification')
    , paginator;


  var Router = Backbone.Router.extend({

    routes: {
      'admin/asset': 'index',
      'admin/asset/:page': 'page'
    },

    index: function () {
      paginator.collection.goTo(1);
    },

    page: function (page) {
      paginator.collection.goTo(parseInt(page, 10));
    }

  });

  var assetManager = new AssetManagerView({
    model: new AssetManagerModel()
  }).render();

  var appRouter = new Router();

  paginator = new PaginationView({
    collection: new PaginatedCollection(),
    el: $('#asset-list'),
    router: appRouter
  });

  assetManager.model.on('newAsset', function (asset) {

    notification
      .notify('Asset uploaded')
      .effect('slide');

    // Reset the paginator view
    var currentPage = paginator.collection.currentPage;
    paginator.collection.goTo(currentPage);

  });

  Backbone.history.start({ pushState: true });

}());