module.exports = function () {
  //
  // SELECT2 SELECT ELEMENTS
  // =======================
  // Converts regular and multiple select elements into richer UI components
  // through search, dyamic data, tagging, skinning and more.
  // http://ivaynberg.github.com/select2/
  //


  //
  // SINGLE SELECT ELEMENTS
  //

  $('select.select2:not([multiple])').select2({
      // Set a `data-minimum-search` attribute to control when the search bar appears.
      minimumResultsForSearch: $(this).data('minimum-search') ? $(this).data('minimum-search') : 8
    , allowClear: true
  })


  //
  // MULTIPLE SELECT ELEMENTS
  //

  $('select.select2[multiple]').select2({
      // To set a max selection size, use a `data-max` attribute on the input.
      maximumSelectionSize: $(this).data('max') ? $(this).data('max-selection') : 0
    , closeOnSelect: true
  })


  //
  // FREE TAGGING ELEMENTS
  // Uses a hidden input so user can add custom values. Styled to match
  // the multiple select elements.
  //

  $('input.select2[type="hidden"]').each(function() {

    // Settings
    var $this = $(this)
      // To set a max selection size, use a `data-max` attribute on the input.
      , maximumSelectionSize = $this.data('max') ? $this.data('max-selection') : 0
      , closeOnSelect = true
      , tokenSeparators = [',']
      // Example tags
      , tags = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa']

    // Find any 'Suggested Tag Buttons' connected to the input.
    // Currently clicking one of these replaces existing content, ideally
    // this will be updated to append clicked value to existing content.
    $this.closest('.form-row').find('.select2-tag').each(function(){
      $(this).on('click', function(e) {
        e.preventDefault()
        if (!$this.attr('disabled')) {
          $this.val($(this).data('value')).trigger('change')
        }
      })
    })

    // Set up the element with the specified settings
    $this.select2({
        maximumSelectionSize: maximumSelectionSize
      , closeOnSelect: closeOnSelect
      , tags: tags
      , tokenSeparators: tokenSeparators
    })

  })
}