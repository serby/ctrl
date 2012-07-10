module('AssetItemModel', function (module) {

  var AssetItemModel = Backbone.Model.extend({

    initialize: function () {
      _.bindAll(this);
    },

    idAttribute: '_id',

    getThumbnail : function () {
      if ((/^image\//).test(this.get('type'))) {
        return '/asset/thumb/' + this.get('_id') +
               '/' + this.get('basename');
      } else {
        return '/images/file.png';
      }
    }

  });

  module.exports = AssetItemModel;

});