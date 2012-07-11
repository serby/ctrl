module('AssetManagerView', function (module) {

  var FileUploadView = require('FileUploadView');

  var AssetManagerView = Backbone.View.extend({

    initialize: function () {
      var uploadView = new FileUploadView({
        model: this.model
      });
    }

  });

  module.exports = AssetManagerView;

});