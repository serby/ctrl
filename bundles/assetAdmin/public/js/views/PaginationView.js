module('PaginationView', function (module) {

  var AssetItemView = require('AssetItemView');

  var PaginationView = Backbone.View.extend({

    template: _.template($('#asset-list-template').html()),

    initialize: function () {
      _.bindAll(this);
      this.collection.on('reset', this.render, this);
    },

    events: {
      'click .next': 'next',
      'click .prev': 'prev',
      'click [data-index]': 'goTo',
      'click .first': 'first',
      'click .last': 'last'
    },

    next: function (e) {
      e.preventDefault();
      if (this.collection.pagination.end === this.collection.currentPage) {
        return;
      } else {
        this.collection.requestNextPage();
        this.options.router.navigate('/admin/asset/' + this.collection.currentPage);
      }
    },

    prev: function (e) {
      e.preventDefault();
      if (this.collection.currentPage === 1) {
        return;
      } else {
        this.collection.requestPreviousPage();
        this.options.router.navigate('/admin/asset/' + this.collection.currentPage);
      }
    },

    goTo: function (e) {
      e.preventDefault();
      var index = parseInt($(e.currentTarget).attr('data-index'), 10);
      if (index < 1 || index > this.collection.pagination.end) {
        return;
      } else {
        this.collection.goTo(index);
        this.options.router.navigate('/admin/asset/' + this.collection.currentPage);
      }
    },

    first: function (e) {
      e.preventDefault();
      this.collection.goTo(1);
      this.options.router.navigate('/admin/asset/' + this.collection.currentPage);
    },

    last: function (e) {
      e.preventDefault();
      this.collection.goTo(this.collection.pagination.end);
    },

    render: function () {

      var html = $(this.template(this.collection.pagination))
        , assets = html.eq(0);

      this.collection.each(function (asset) {
        assets.append(new AssetItemView({
          model: asset
        }).render().$el);
      }, this);

      this.$el.html(html);

      return this;

    }

  });

  module.exports = PaginationView;

});