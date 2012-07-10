module('AssetItemDetailsView', function (module) {

  var AssetItemDetailsView = Backbone.View.extend({

    template: _.template($('#asset-list-item-details-template').html()),

    className: 'editable',

    initialize: function () {
      _.bindAll(this);
      this.$el.attr('data-field-name', this.options.field);
      this.editting = false;
    },

    events: {
      'cancel': 'blurAndCancel',
      'save': 'blurAndSave',
      'click': 'focus'
    },

    blurAndCancel: function () {
      this.blur(false);
    },

    blurAndSave: function () {
      this.blur(true);
    },

    blur: function (save) {

      this.editting = false;

      if (save && this.data.text() !== this.input.val()) {
        this.data.text(this.input.val());
        this.model.set(this.options.field, this.data.text());
        this.model.save();
      }

      this.input.hide();
      if (this.data.text() === '') {
        this.placeholder
          .text('Click to add')
          .show();
        this.data.hide();
      } else {
        this.data.show();
        this.placeholder.hide();
      }

    },

    focus: function () {

      if (this.editting) {
        return;
      }

      this.editting = true;

      this.data.hide();
      this.placeholder.hide();
      this.input.val(this.data.text());
      this.input.show();
      this.input.focus();

      function blur(e) {
        this.$el.trigger('save');
        this.input.off('blur', blur);
        this.input.off('keydown', keydown);
      }

      function keydown(e) {
        if (e.keyCode === 13 || e.keyCode === 9) {
          this.$el.trigger('save');
          this.input.off('blur', blur);
          this.input.off('keydown', keydown);
        } else if (e.keyCode === 27) {
          this.$el.trigger('cancel');
          this.input.off('blur', blur);
          this.input.off('keydown', keydown);
        }
      }

      this.input.on('keydown', _.bind(keydown, this));
      this.input.on('blur', _.bind(blur, this));

    },

    render: function () {

      this.$el.html(this.template({
        field: this.model.get(this.options.field),
        label: this.options.field.charAt(0).toUpperCase() +
               this.options.field.slice(1).toLowerCase()
      }));

      // Cache the elements
      this.input = this.$el.find('input');
      this.placeholder = this.$el.find('.placeholder');
      this.data = this.$el.find('.data');

      this.blurAndCancel();

      return this;
    }

  });

  module.exports = AssetItemDetailsView;

});