module('PaginatedCollection', function (module) {

  var AssetItemModel = require('AssetItemModel');

  // Uses the Backbone.Paginator:
  // https://github.com/addyosmani/backbone.paginator/
  var PaginatedCollection = Backbone.Paginator.requestPager.extend({

    model: AssetItemModel,

    url: '/admin/asset/api',

    paginator_core: {
      type: 'GET',
      dataType: 'json',
      url: '/admin/asset/api'
    },

    paginator_ui: {
      firstPage: 1,
      currentPage: 1,
      perPage: 3
    },

    server_api: {
      paginate: true,
      Page: function () { return this.currentPage }
    },

    parse: function (response) {
      this.pagination = response.pagination;
      return response.results;
    }

  });

  module.exports = PaginatedCollection;

});