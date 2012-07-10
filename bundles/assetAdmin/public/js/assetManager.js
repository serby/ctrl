(function () {

  var AssetManagerView = require('AssetManagerView')
    , AssetManagerModel = require('AssetManagerModel')
    , AssetItemView = require('AssetItemView')
    , notification = require('notification');

  var assetManager = new AssetManagerView({
    model: new AssetManagerModel()
  }).render();

  assetManager.model.on('populate', function () {
    assetManager.model.assets.each(function (asset) {
      $('#asset-list').append(new AssetItemView({
        model: asset
      }).render().$el);
    });
  });

  assetManager.model.on('newAsset', function (asset) {

    notification
      .notify('Asset uploaded')
      .effect('slide');

    $('#asset-list').append(new AssetItemView({
        model: asset
    }).render().$el);

  });

}());