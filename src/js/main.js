$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  // BREAKPOINT SETTINGS
  var bp = {
    mobileS: 375,
    mobile: 680,
    tablet: 768,
    desktop: 992,
    wide: 1336,
    hd: 1680
  }

  var easingSwing = [.02, .01, .47, 1]; // default jQuery easing for anime.js

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady(){
    legacySupport();
    updateHeaderActiveClass();
    initHeaderScroll();

    initSelectric();
    initPopups();
    initSliders();
    initScrollMonitor();
    initMasks();
    initLazyLoad();
    initPerfectScrollbar();
    initRangeSlider();
    initAutocompleate();
    initValidations();

    revealFooter();
    _window.on('resize', throttle(revealFooter, 100));

    // development helper
    _window.on('resize', debounce(setBreakpoint, 200))


  }

  // this is a master function which should have all functionality
  pageReady();


  // some plugins work best with onload triggers
  _window.on('load', function(){
    // your functions
  })


  // detectors
  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }

  function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true
    } else {
      return false
    }
  }

  if ( msieversion() ){
    $('body').addClass('is-ie');
  }

  if ( isMobile() ){
    $('body').addClass('is-mobile');
  }



  //////////
  // COMMON
  //////////

  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: true,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }


  // Prevent # behavior
	_document
    .on('click', '[href="#"]', function(e) {
  		e.preventDefault();
  	})
    .on('click', 'a[href^="#section"]', function() { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
          scrollTop: $(el).offset().top}, 1000);
      return false;
    })


  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function initHeaderScroll(){
    _window.on('scroll', throttle(function(e) {
      var vScroll = _window.scrollTop();
      var header = $('.header').not('.header--static');
      var headerHeight = header.height();
      var firstSection = _document.find('.page__content div:first-child()').height() - headerHeight;

      if ( vScroll > headerHeight ){
        header.addClass('is-fixed');
      } else {
        header.removeClass('is-fixed');
      }
      if ( vScroll > firstSection ){
        header.addClass('is-fixed-visible');
      } else {
        header.removeClass('is-fixed-visible');
      }

    }, 10));
  }

  // FOOTER REVEAL
  function revealFooter() {
    var footer = $('[js-reveal-footer]');
    if (footer.length > 0) {
      var footerHeight = footer.outerHeight();
      var maxHeight = _window.height() - footerHeight > 200;
      if (maxHeight && !msieversion() && !isMobile() ) {
        $('body').css({
          'margin-bottom': footerHeight
        });
        footer.css({
          'position': 'fixed',
          'z-index': -10
        });
      } else {
        $('body').css({
          'margin-bottom': 0
        });
        footer.css({
          'position': 'static',
          'z-index': 10
        });
      }
    }
  }

  _document
    .on('click', '[js-footer-nav-collapse]', function(e){
      if ( _window.width() < bp.tablet ){

        if ( $(e.target).closest('.footer__nav-list').length > 0 ){
          e.stopPropagation();
        } else {
          $(this).closest('.footer__nav-collapse').toggleClass('is-opened');

          revealFooter();

        }
      }
    })

  // HAMBURGER TOGGLER
  _document
    .on('click', '[js-hamburger]', function(){
      $(this).toggleClass('is-active');
      $('.header').toggleClass('is-menu-opened');
      $('.m-navi').toggleClass('is-active');
    })
    .on('click', '[js-header-search]', function(){
      $('[js-hamburger]').removeClass('is-active');
      $(this).toggleClass('is-active');
      $('.header').toggleClass('is-menu-opened');
      $('.m-search').toggleClass('is-active');
    })
    .on('click', '[js-close-mobile-search]', function(){
      closeMobileMenu();
    })
    .on('click', '[js-reset-mobile-search]', function(){
      var form = $(this).closest('.m-search');

      form.find('input[type="text"]').val('');
      form.find('input[type="radio"]').prop('checked', false);
    })

  function closeMobileMenu(){
    $('[js-hamburger]').removeClass('is-active');
    $('[js-header-search]').removeClass('is-active');
    $('.header').removeClass('is-menu-opened');
    $('.m-navi').removeClass('is-active');
    $('.m-search').removeClass('is-active');
  }




  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering when header is inside barba-container
  function updateHeaderActiveClass(){
    $('.header__menu li').each(function(i,val){
      if ( $(val).find('a').attr('href') == window.location.pathname.split('/').pop() ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }

  //////////
  // TABS
  //////////
  _document.on('click', '[js-tab]', function(e){
    var targetName = $(this).data('target');
    var targetEl = $("[data-tab="+ targetName + "]");

    if ( targetName && targetEl ){
      $(this).siblings().removeClass('is-active');
      $(this).addClass('is-active');

      targetEl.siblings().slideUp();
      targetEl.slideDown();

      triggerBody();
    }
  })

  //////////
  // SLIDERS
  //////////

  function initSliders(){
    var slickNextArrow = '<div class="slick-prev"><svg class="ico ico-back-arrow"><use xlink:href="img/sprite.svg#ico-back-arrow"></use></svg></div>';
    var slickPrevArrow = '<div class="slick-next"><svg class="ico ico-next-arrow"><use xlink:href="img/sprite.svg#ico-next-arrow"></use></svg></div>'

    // Why carousel
    new Swiper('[js-hot-slider]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "hot-slider__slide",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 0,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true,
      navigation: {
        nextEl: '.hot-slider__next',
        prevEl: '.hot-slider__prev',
      },
    })
    $('[js-hotCard-slider]').each(function(i, slider){
      new Swiper($(slider), {
        wrapperClass: "swiper-wrapper",
        slideClass: "hot-card__image",
        direction: 'horizontal',
        nested: true,
        loop: true,
        watchOverflow: false,
        setWrapperSize: true,
        spaceBetween: 0,
        slidesPerView: 1,
        effect: 'fade',
        normalizeSlideIndex: true,
        navigation: {
          nextEl: '.hot-card__images-next',
          prevEl: '.hot-card__images-prev',
        },
      })
    })




  }

  //////////
  // MODALS
  //////////

  function initPopups(){
    // Magnific Popup
    var startWindowScroll = 0;
    $('[js-popup]').magnificPopup({
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'popup-buble',
      callbacks: {
        beforeOpen: function() {
          startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');
        },
        close: function() {
          // $('html').removeClass('mfp-helper');
          _window.scrollTop(startWindowScroll);
        }
      }
    });

    $('[js-popupVideo]').magnificPopup({
      type: 'iframe',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'popup-buble',
      patterns: {
        youtube: {
          index: 'youtube.com/',
          id: 'v=', // String that splits URL in a two parts, second part should be %id%
          src: '//www.youtube.com/embed/%id%?autoplay=1&controls=0&showinfo=0' // URL that will be set as a source for iframe.
        }
      },
      // closeMarkup: '<button class="mfp-close"><div class="video-box__close-button btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src="img/setting/video_close.svg" alt=""/></div></button>'
    });

    $('[js-popup-gallery]').magnificPopup({
  		delegate: 'a',
  		type: 'image',
  		tLoading: 'Загрузка #%curr%...',
  		mainClass: 'popup-buble',
  		gallery: {
  			enabled: true,
  			navigateByImgClick: true,
  			preload: [0,1]
  		},
  		image: {
  			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
  		}
  	});
  }

  function closeMfp(){
    $.magnificPopup.close();
  }

  ////////////
  // SCROLLBAR
  ////////////
  function initPerfectScrollbar(){
    if ( $('[js-scrollbar]').length > 0 ){
      $('[js-scrollbar]').each(function(i, scrollbar){
        if ( $(scrollbar).not('.ps') ){ // if it initialized

          var xAvail = $(scrollbar).data('x-disable') || false; // false is default
          var yAvail = $(scrollbar).data('y-disable') || false; // false is default
          console.log(yAvail)
          var ps = new PerfectScrollbar(scrollbar, {
            suppressScrollX: xAvail,
            suppressScrollY: yAvail,
            wheelPropagation: true,
            minScrollbarLength: 20
          });
        }
      })
    }
  }

  ////////////
  // RANGESLIDER
  ////////////
  function initRangeSlider(){
    var sliders = $('[js-rangeslider]');

    if ( sliders.length > 0 ){
      sliders.each(function(i, slider){
        noUiSlider.create(slider, {
          start: [0, 35000000],
          connect: true,
          range: {
            'min': 0,
            'max': 50000000
          }
        });

        var priceValues = [
        	$('[js-range-from]').get(0),
        	$('[js-range-to]').get(0),
        ];

        slider.noUiSlider.on('update', function( values, handle ) {
        	priceValues[handle].innerHTML = parseInt(values[handle]).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");;
        });

      })
    }
  }


  ////////////
  // AUTOCOMPLEATE
  ////////////
  function initAutocompleate(){
    var autocompleate = $('[js-autocomplete]');

    if ( autocompleate.length > 0 ){
      autocompleate.each(function(i, input){
        $(input).easyAutocomplete({
          url: $(input).data('url'),
          getValue: "name",
          list: {
            match: {
              enabled: true
            },
            showAnimation: {
        			type: "fade", //normal|slide|fade
        			time: 200,
        		},
        		hideAnimation: {
        			type: "slide", //normal|slide|fade
        			time: 200,
        		}
          },
        });

      })
    }
  }


  ////////////
  // UI
  ////////////

  function initSelectric(){
    $('[js-selectric]').each(function(i, select){
      var icon = $(select).data('icon') || 'drop-arrow';
      console.log(icon)
      var btn = '<b class="button"><svg class="ico ico-'+icon+'"><use xlink:href="img/sprite.svg#ico-'+icon+'"></use></svg></b>';

      $(select).selectric({
        maxHeight: 300,
        arrowButtonMarkup: btn,

        onInit: function(element, data){
          var $elm = $(element),
              $wrapper = $elm.closest('.' + data.classes.wrapper);

          $wrapper.find('.label').html($elm.attr('placeholder'));
        },
        onBeforeOpen: function(element, data){
          var $elm = $(element),
              $wrapper = $elm.closest('.' + data.classes.wrapper);

          $wrapper.find('.label').data('value', $wrapper.find('.label').html()).html($elm.attr('placeholder'));
        },
        onBeforeClose: function(element, data){
          var $elm = $(element),
              $wrapper = $elm.closest('.' + data.classes.wrapper);

          $wrapper.find('.label').html($wrapper.find('.label').data('value'));
        }
      });
    })

  }

  // textarea autoExpand
  _document
    .one('focus.autoExpand', '.ui-group textarea', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', '.ui-group textarea', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });

  // Masked input
  function initMasks(){
    $("[js-dateMask]").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
    $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});
    $("[js-mask-number]").mask("999 999 999")
  }


  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor(){
    $('.wow').each(function(i, el){

      var elWatcher = scrollMonitor.create( $(el) );

      var delay;
      if ( $(window).width() < 768 ){
        delay = 0
      } else {
        delay = $(el).data('animation-delay');
      }

      var animationClass = $(el).data('animation-class') || "wowFadeUp"

      var animationName = $(el).data('animation-name') || "wowFade"

      elWatcher.enterViewport(throttle(function() {
        $(el).addClass(animationClass);
        $(el).css({
          'animation-name': animationName,
          'animation-delay': delay,
          'visibility': 'visible'
        });
      }, 100, {
        'leading': true
      }));
      // elWatcher.exitViewport(throttle(function() {
      //   $(el).removeClass(animationClass);
      //   $(el).css({
      //     'animation-name': 'none',
      //     'animation-delay': 0,
      //     'visibility': 'hidden'
      //   });
      // }, 100));
    });

  }


  //////////
  // LAZY LOAD
  //////////
  function initLazyLoad(){
    _document.find('[js-lazy]').Lazy({
      threshold: 500,
      enableThrottle: true,
      throttle: 100,
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      effectTime: 350,
      // visibleOnly: true,
      // placeholder: "data:image/gif;base64,R0lGODlhEALAPQAPzl5uLr9Nrl8e7...",
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      },
      beforeLoad: function(element){
        // element.attr('style', '')
      }
    });
  }

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      var deferred = Barba.Utils.deferred();

      anime({
        targets: this.oldContainer,
        opacity : .5,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim){
          deferred.resolve();
        }
      })

      return deferred.promise
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : .5
      });

      anime({
        targets: "html, body",
        scrollTop: 0,
        easing: easingSwing, // swing
        duration: 150
      });

      anime({
        targets: this.newContainer,
        opacity: 1,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim) {
          triggerBody()
          _this.done();
        }
      });
    }
  });

  // set barba transition
  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

    pageReady();
    closeMobileMenu();

  });

  // some plugins get bindings onNewPage only that way
  function triggerBody(){
    $(window).scroll();
    $(window).resize();
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint(){
    var wHost = window.location.host.toLowerCase()
    var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
    if (displayCondition){
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>"+wWidth+"</div>";

      $('.page').append(content);
      setTimeout(function(){
        $('.dev-bp-debug').fadeOut();
      },1000);
      setTimeout(function(){
        $('.dev-bp-debug').remove();
      },1500)
    }
  }

  function initValidations(){
    ////////////////
    // FORM VALIDATIONS
    ////////////////

    // jQuery validate plugin
    // https://jqueryvalidation.org


    // GENERIC FUNCTIONS
    ////////////////////

    var validateErrorPlacement = function(error, element) {
      error.addClass('ui-input__validation');
      error.appendTo(element.parent());
    }
    var validateHighlight = function(element) {
      $(element).addClass("has-error");
    }
    var validateUnhighlight = function(element) {
      $(element).removeClass("has-error");
    }
    var validateSubmitHandler = function(form) {
      $(form).addClass('loading');
      $.ajax({
        type: "POST",
        url: $(form).attr('action'),
        data: $(form).serialize(),
        success: function(response) {
          $(form).removeClass('loading');
          var data = $.parseJSON(response);
          if (data.status == 'success') {
            // do something I can't test
          } else {
              $(form).find('[data-error]').html(data.message).show();
          }
        }
      });
    }

    var validatePhone = {
      required: true,
      normalizer: function(value) {
          var PHONE_MASK = '+X (XXX) XXX-XXXX';
          if (!value || value === PHONE_MASK) {
              return value;
          } else {
              return value.replace(/[^\d]/g, '');
          }
      },
      minlength: 11,
      digits: true
    }

    ////////
    // FORMS


    /////////////////////
    // REGISTRATION FORM
    ////////////////////
    // $(".js-registration-form").validate({
    //   errorPlacement: validateErrorPlacement,
    //   highlight: validateHighlight,
    //   unhighlight: validateUnhighlight,
    //   submitHandler: validateSubmitHandler,
    //   rules: {
    //     last_name: "required",
    //     first_name: "required",
    //     email: {
    //       required: true,
    //       email: true
    //     },
    //     password: {
    //       required: true,
    //       minlength: 6,
    //     }
    //     // phone: validatePhone
    //   },
    //   messages: {
    //     last_name: "Заполните это поле",
    //     first_name: "Заполните это поле",
    //     email: {
    //         required: "Заполните это поле",
    //         email: "Email содержит неправильный формат"
    //     },
    //     password: {
    //         required: "Заполните это поле",
    //         email: "Пароль мимимум 6 символов"
    //     },
    //     // phone: {
    //     //     required: "Заполните это поле",
    //     //     minlength: "Введите корректный телефон"
    //     // }
    //   }
    // });

    $("[js-validate-subscribe]").validate({
      errorPlacement: function(error, element) {
        element.closest('.footer__subscribe').find('.ui-input__validation').remove();
        error.addClass('ui-input__validation');
        error.appendTo(element.closest('.footer__subscribe'));
      },
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        email: {
          required: true,
          email: true
        }
      },
      messages: {
        email: {
          required: "Заполните это поле",
          email: "Email содержит неправильный формат"
        }
      }
    });


  }
});
