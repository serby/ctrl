module('AssetItemDetailsView', function (module) {

  var AssetItemDetailsView = Backbone.View.extend({

    template: _.template($('#asset-list-item-details-template').html()),

    className: 'editable',

    initialize: function () {
      _.bindAll(this);
      this.$el.attr('data-field-name', this.options.field);
    },

    events: {
      'cancel': 'blurAndCancel',
      'save': 'blurAndSave'
    },

    blurAndCancel: function () {

      var input = this.$el.find('input')
        , placeholder = this.$el.find('.placeholder')
        , data = this.$el.find('.data');

      input.hide();
      if (data.text() === '') {
        placeholder
          .text('Click to add')
          .show();
        data.hide();
      } else {
        data.show();
        placeholder.hide();
      }

    },

    blurAndSave: function () {

    },

    render: function () {
      this.$el.html(this.template({
        field: this.model.get(this.options.field),
        label: this.options.field.charAt(0).toUpperCase() +
               this.options.field.slice(1).toLowerCase()
      }));
      this.blurAndCancel();
      return this;
    }

  });

  module.exports = AssetItemDetailsView;

});