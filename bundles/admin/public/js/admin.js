window.module('control-misc-ui', function (module) {

  $(function() {

    // /** jQuery UI Datepicker **/
    // $.datepicker.setDefaults({dayNamesMin: $.datepicker._defaults.dayNamesShort});
    // $(".datepicker").datepicker(
    //   { dateFormat: 'DD d MM, yy'
    //   , showOtherMonths: true
    //   , selectOtherMonths: true
    //   , minDate: 0
    //   , firstDay: 1
    //   , beforeShow : function (input, picker) {
    //       picker.dpDiv
    //         .removeClass('above')
    //         .removeClass('below');
    //       setTimeout(function () {
    //         var dppos = $(picker.dpDiv).offset().top
    //          , inputpos = $(input).offset().top;
    //         if (dppos < inputpos) {
    //           picker.dpDiv.addClass('above');
    //         } else {
    //           picker.dpDiv.addClass('below');
    //         }
    //       });
    //     }
    //   });

    /** Chosen Select Boxes **/
    $(".chzn-select").chosen({
        allow_single_deselect: true
      , disable_search_threshold: 10
    });

    // var availableTags = ["ActionScript","AppleScript","Asp","BASIC","C","C++","Clojure","COBOL","ColdFusion","Erlang","Fortran","Groovy","Haskell","Java","JavaScript","Lisp","Perl","PHP","Python","Ruby","Scala","Scheme"];
    // $( ".autocomplete" ).autocomplete({
    //   source: availableTags
    // });

    /** Fancybox **/
    $(".fancybox, [rel='fancybox-group']").fancybox(
      { padding: 0
      , prevEffect: 'fade'
      , nextEffect: 'fade'
      }
    );

    /** Notification Bars **/
    $('.notification.close').append('<a class="button-close" href="#" />');
    $('.notification .button-close').click(function(e){
      $(this).parent('.notification').fadeTo(300, 0).slideUp(300);
      e.preventDefault();
    });

    /* Check nav height */
    function staticNav() {
      var sidenavHeight = $("#main-header").outerHeight() + $("#main-footer").outerHeight();
      var winHeight = $(window).height();
      $("#main-header").css('position', 'fixed');
      if (sidenavHeight > winHeight) {
        $("#main-header").css('position', 'absolute');
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
        .addClass(settings.danger ? 'danger' : 'primary')
        .bind('click', function (e) {
          e.preventDefault();
          remove();
          settings.confirm();
        })
    );

    controls.append(
      $('<button/>').text(settings.denyVerb)
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
  $('a.button.delete').on('click', function (e) {
    window.confirmDialog({
      message: 'Are you sure you want to delete this?',
      confirm: function () {
        document.location.href = $(e.target).attr('href');
      },
      confirmVerb: 'Delete',
      denyVerb: 'Don\'t delete'
    });
    return false;

  });

});

window.require('control-misc-ui');