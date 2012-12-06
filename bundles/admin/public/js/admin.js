window.module('control-misc-ui', function (module) {

  $(function() {

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



    //
    // PIKADAY DATEPICKER
    //

    $('.datepicker input').each(function(){
      var picker = new Pikaday({
          field: this
        , firstDay: 1
      })
    })





    /** Fancybox **/
    $('.fancybox, [rel="fancybox-group"]').fancybox(
      { padding: 2
      , prevEffect: 'fade'
      , nextEffect: 'fade'
      }
    );

    /** Notification Bars **/
    var notificationClose = $('<button />').addClass('button-close').text('Close')
    $('.notification.close').append(notificationClose)
    $('.notification .button-close').click(function(e){
      $(this).parent('.notification').fadeTo(300, 0).slideUp(300);
      e.preventDefault();
    });

    /* Check nav height */
    function staticNav() {
      var mainHeader = $('.main-header')
        , winHeight = $(window).height()
        , sidebarHeight = $('.user-navigation').outerHeight(true) +
                          $('.site-logo').outerHeight(true) +
                          $('.main-navigation').outerHeight(true) +
                          $('.main-footer').outerHeight(true)

      if (sidebarHeight > winHeight) {
        mainHeader.css('position', 'absolute')
      }
    }

    staticNav();

    $(window).resize(function () {
      staticNav();
    });

    /** Third Level Collapsable Navigation **/
    $('.sub-nav .sub-nav').hide().siblings('a').addClass('nav-expandable');
    $('a.nav-expandable').click( function(e){
      $(this).toggleClass('nav-expanded').siblings('.sub-nav').slideToggle(400, function(){staticNav();});
      e.preventDefault();
    });

    /** Scroll to Anchors **/
    /** http://css-tricks.com/snippets/jquery/smooth-scrolling/ **/
    function filterPath(string) {
    return string
      .replace(/^\//,'')
      .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
      .replace(/\/$/,'');
    }
    var locationPath = filterPath(location.pathname);
    var scrollElem = scrollableElement('html', 'body');

    $('a[href*=#]').each(function() {
      var thisPath = filterPath(this.pathname) || locationPath;
      if (  locationPath === thisPath && (location.hostname === this.hostname || !this.hostname)  && this.hash.replace(/#/,'') ) {
        var $target = $(this.hash)
          , target = this.hash;
        if (target && $target.offset()) {
          var targetOffset = $target.offset().top;
          $(this).click(function(event) {
            event.preventDefault();
            $(scrollElem).stop().animate({scrollTop: targetOffset}, 400, function() {
              location.hash = target;
            });
          });
        }
      }
    });
    // use the first element that is "scrollable"
    function scrollableElement(els) {
      for (var i = 0, argLength = arguments.length; i <argLength; i++) {
        var el = arguments[i],
            $scrollElement = $(el);
        if ($scrollElement.scrollTop()> 0) {
          return el;
        } else {
          $scrollElement.scrollTop(1);
          var isScrollable = $scrollElement.scrollTop()> 0;
          $scrollElement.scrollTop(0);
          if (isScrollable) {
            return el;
          }
        }
      }
      return [];
    }

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
    };

    settings = $.extend(settings, options);

    var dialog = $('<div/>').addClass('dialog-confirm');
    var overlay = $('<div/>').addClass('dialog-overlay');
    dialog.append($('<p/>').text(settings.message));

    function remove() {
      overlay.remove();
      dialog.remove();
    }

    var controls = $('<div/>').addClass('controls');

    controls.append(
      $('<button/>').text(settings.confirmVerb)
        .addClass('button')
        .addClass(settings.danger ? 'button-error' : 'button-primary')
        .bind('click', function (e) {
          e.preventDefault();
          remove();
          settings.confirm();
        })
    );

    controls.append(
      $('<button/>').text(settings.denyVerb)
        .addClass('button')
        .bind('click', function (e) {
          e.preventDefault();
          remove();
          settings.deny();
        })
    );

    dialog.append(controls);
    $('body').append(overlay, dialog);

  }

  window.confirmDialog = confirm;

  });

  // Intercept all clicks on links with class
  // 'delete' and get the user to confirm first...
  $('.delete-button').submit(function () {
    var deleteForm = this;
    window.confirmDialog({
      message: 'Are you sure you want to delete this?',
      confirm: function () {
        deleteForm.submit();
      },
      confirmVerb: 'Delete',
      denyVerb: 'Don\'t delete'
    });
    return false;

  });

});

window.require('control-misc-ui');