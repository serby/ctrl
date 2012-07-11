(function () {

  var AssetManagerView = require('AssetManagerView')
    , AssetManagerModel = require('AssetManagerModel')
    , AssetItemView = require('AssetItemView')
    , PaginatedCollection = require('PaginatedCollection')
    , PaginationView = require('PaginationView')
    , notification = require('notification');

  var assetManager = new AssetManagerView({
    model: new AssetManagerModel()
  }).render();

  var paginator = new PaginationView({
    collection: new PaginatedCollection(),
    el: $('#asset-list')
  });

  assetManager.model.on('newAsset', function (asset) {

    notification
      .notify('Asset uploaded')
      .effect('slide');

    // Reset the paginator view
    var currentPage = paginator.collection.currentPage;
    paginator.collection.goTo(currentPage);

  });


}());