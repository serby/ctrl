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

  assetManager.model.on('newAsset', function (asset) {

    notification
      .notify('Asset uploaded')
      .effect('slide');

  });

  var paginator = new PaginationView({
    collection: new PaginatedCollection(),
    el: $('#asset-list')
  });

}());