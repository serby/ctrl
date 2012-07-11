module('AssetManagerModel', function (module) {

  var AssetItemCollection = require('AssetItemCollection');

  var AssetManagerModel = Backbone.Model.extend({

    initialize: function () {

      _.bindAll(this);

      this.assets = new AssetItemCollection();
      this.assets.fetch({

        success: _.bind(function () {
          this.trigger('populate');
        }, this)

      });

      this.on('addAsset', this.addAsset);

    },

    addAsset: function (asset) {
      var newAsset = this.assets.create(asset, { silent: true });
      this.trigger('newAsset', newAsset);
    }

  });

  module.exports = AssetManagerModel;

});