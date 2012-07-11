module('AssetItemCollection', function (module) {

  var AssetItemModel = require('AssetItemModel');

  var AssetItemCollection = Backbone.Collection.extend({

    model: AssetItemModel,

    url: '/admin/asset/api'

  });

  module.exports = AssetItemCollection;

});