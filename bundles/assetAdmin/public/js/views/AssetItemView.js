module('AssetItemView', function (module) {

  var AssetItemDetailsView = require('AssetItemDetailsView')
    , notification = require('notification');


  var AssetItemView = Backbone.View.extend({

    initialize: function () {

      var editableFields = ['title', 'description', 'tags'];
      this.editableFields = $('<div/>');
      _.each(editableFields, function (field) {
        this.editableFields.append(new AssetItemDetailsView({
          model: this.model,
          field: field
        }).render().$el);
      }, this);

      // Remove when the model is destroyed
      this.model.on('destroy', _.bind(function () {
        this.remove();
      }, this));

      this.model.on('sync', function (model, collection) {
        if (model.changedAttributes()) {
          return;
        }
        notification
          .notify('Asset details saved')
          .effect('slide');
      });

      this.model.on('error', function () {
        notification
          .error('Failed to save')
          .effect('slide');
      });

    },

    template: _.template($('#asset-list-item-template').html()),

    className: 'panel-asset-item',

    events: {
      'click button.delete': 'del',
      'click .editable': 'editField'
    },

    del: function () {

      window.confirmDialog({
        message: 'Are you sure you want to delete this asset? Any ' +
                  'links to it will break.',
        confirm: _.bind(function () {
          this.model.destroy({
            success: function () {
              notification
                .notify('Asset deleted')
                .effect('slide');
            }
          });
        }, this),
        confirmVerb: 'Delete asset',
        denyVerb: 'Don\'t delete',
        danger: true
      });

    },

    editField: function (e) {
      var field = $(e.currentTarget);
    },

    render: function () {
      var data = _.extend(this.model.toJSON(), {
        preview: this.model.getThumbnail()
      });
      this.$el.html(this.template(data));
      this.$el.find('.asset-item-details').append(this.editableFields);
      return this;
    }

  });

  module.exports = AssetItemView;

});