module.exports = function () {

  /*
   * A custom confirm overlay, alternative
   * to window.confirm (with more options)
   */
  function confirm(options) {

    var settings = {
      message: 'Are you sure?',
      confirm: function () {},
      deny: function () {},
      confirmVerb: 'Confirm',
      denyVerb: 'Cancel',
      danger: false
    }

    settings = $.extend(settings, options)

    var dialog = $('<div/>').addClass('dialog-confirm')
    var overlay = $('<div/>').addClass('dialog-overlay')
    dialog.append($('<p/>').text(settings.message))

    function remove() {
      overlay.remove()
      dialog.remove()
    }

    var controls = $('<div/>').addClass('controls')

    controls.append(
      $('<button/>').text(settings.confirmVerb)
        .addClass('button')
        .addClass(settings.danger ? 'button-error' : 'button-primary')
        .bind('click', function (e) {
          e.preventDefault()
          remove()
          settings.confirm()
        })
    )

    controls.append(
      $('<button/>').text(settings.denyVerb)
        .addClass('button')
        .bind('click', function (e) {
          e.preventDefault()
          remove()
          settings.deny()
        })
    )

    dialog.append(controls)
    $('body').append(overlay, dialog)

  }

  window.confirmDialog = confirm

  // Intercept all clicks on links with class
  // 'delete' and get the user to confirm first...
  $('.form-delete-button').submit(function () {
    var deleteForm = this
    window.confirmDialog({
      message: 'Are you sure you want to delete this?',
      confirm: function () {
        deleteForm.submit()
      },
      confirmVerb: 'Delete',
      denyVerb: 'Don\'t delete'
    })
    return false

  })
}