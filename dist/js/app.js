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
    // benefitsTabFix();
    cardsLoaded();

    initSelectric();
    initPopups();
    initSliders();
    initScrollMonitor();
    initMasks();
    initLazyLoad();
    initPerfectScrollbar();
    initRangeSlider();
    initAutocompleate();
    initSticky();
    initTeleport();
    initValidations();
    initMaps();

    hookPrint();

    positionScrollTop();
    _window.on('resize', debounce(positionScrollTop, 250));
    _window.on('scroll', throttle(showScrollTop, 50));

    controlTabsMobileClass();
    _window.on('resize', debounce(controlTabsMobileClass, 250));

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

  function isIphoneX(){
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var ratio = window.devicePixelRatio || 1;
    var screen = {
      width : window.screen.width * ratio,
      height : window.screen.height * ratio
    };

    // iPhone X Detection
    if (iOS && screen.width == 1125 && screen.height === 2436) {
      $('body').addClass('is-iphone-x')
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

  var preventKeys = {
    37: 1, 38: 1, 39: 1, 40: 1
  };

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
      e.preventDefault();
    e.returnValue = false;
  }

  function preventDefaultForScrollKeys(e) {
    if (preventKeys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }
  var lastScroll = 0;

  function disableScroll() {
    lastScroll = _window.scrollTop()
    $('.page__content').css({
      'margin-top': '-' + lastScroll + 'px'
    });
    $('body').addClass('body-lock');
    // var target = $('.page').get(0)
    // if (window.addEventListener) // older FF
    //   target.addEventListener('DOMMouseScroll', preventDefault, false);
    // target.onwheel = preventDefault; // modern standard
    // target.onmousewheel = target.onmousewheel = preventDefault; // older browsers, IE
    // target.ontouchmove = preventDefault; // mobile
    // target.onkeydown = preventDefaultForScrollKeys;
  }

  function enableScroll() {
    $('.page__content').attr('style', '');
    $('body').removeClass('body-lock');
    _window.scrollTop(lastScroll)
    lastScroll = 0;
    // var target = $('.page').get(0)
    // if (window.removeEventListener)
    //   target.removeEventListener('DOMMouseScroll', preventDefault, false);
    // target.onmousewheel = target.onmousewheel = null;
    // target.onwheel = null;
    // target.ontouchmove = null;
    // target.onkeydown = null;
  }

  function blockScroll(unlock) {
    if ($('[js-hamburger]').is('.is-active') || $('.m-search.is-active').length > 0 ) {
      disableScroll();
    } else {
      enableScroll();
    }

    if (unlock) {
      enableScroll();
    }
  };


  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();

    $(function() {
    	FastClick.attach(document.body);
    });

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
    .on('click', '[js-scrolltop]', function() { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
          scrollTop: 0}, 1000);
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
      var firstSection = 0
      if ( _document.find('.hero').length > 0 ){
        firstSection = _document.find('.page__content div:first-child()').height() - headerHeight;
      }
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

  _document
    .on('click', '[js-footer-nav-collapse]', function(e){
      if ( _window.width() < bp.tablet ){

        if ( $(e.target).closest('.footer__nav-list').length > 0 ){
          e.stopPropagation();
        } else {
          $(this).closest('.footer__nav-collapse').toggleClass('is-opened');

          anime({
            targets: "html, body",
            scrollTop: $('[js-footer-nav-collapse]').offset().top - 48,
            easing: easingSwing, // swing
            duration: 200
          });

        }
      }
    })

  // HAMBURGER TOGGLER
  _document
    .on('click', '[js-hamburger]', function(){
      $(this).toggleClass('is-active');
      $('.header').toggleClass('is-menu-opened');
      $('.m-navi').toggleClass('is-active');

      blockScroll();
    })
    .on('click', '[js-open-mobile]', function(){
      var targetPop = $(this).data('target');

      if ( targetPop ){
        closeMobileMenu();

        $('[js-hamburger]').removeClass('is-active');
        $(this).toggleClass('is-active');
        $('.header').toggleClass('is-menu-opened');

        $('.m-search[data-name="'+targetPop+'"]').toggleClass('is-active');

        blockScroll();
      }
    })
    .on('click', '[js-close-mobile]', function(){
      closeMobileMenu();
    })
    .on('click', '[js-reset-mobile-search]', function(){
      var form = $(this).closest('.m-search');

      form.find('input[type="text"]').val('');
      form.find('input[type="radio"]').prop('checked', false);
      form.find('[js-rangeslider]').get(0).noUiSlider.reset();
    })
    .on('click', '[js-reset-mobile-filter]', function(){
      var form = $(this).closest('.m-search');

      form.find('input[type="text"]').val('');
      form.find('input[type="radio"]').prop('checked', false);
      form.find('[js-rangeslider]').get(0).noUiSlider.reset();
    })

  function closeMobileMenu(){
    blockScroll(true);
    $('[js-hamburger]').removeClass('is-active');
    $('[js-open-header-search]').removeClass('is-active');
    $('.header').removeClass('is-menu-opened');
    $('.m-navi').removeClass('is-active');
    $('.m-search').removeClass('is-active');
  }


  // SCROLL TOP
  function positionScrollTop(){
    if ( $('[js-scrolltop]').length > 0 ){
      var wWidth = _window.width();
      var containerWidth = $('.blog .container').width();
      var calcedPos = ( wWidth - containerWidth ) / 2

      $('[js-scrolltop]').css({
        'right': calcedPos + 'px'
      })
    }

  }

  function showScrollTop(){
    if ( $('[js-scrolltop]').length > 0 ){
      var wScroll = _window.scrollTop();
      var scrollBottom = wScroll + _window.height();
      var containerStop = $('.post__wrapper').offset().top + $('.post__wrapper').outerHeight();
      if ( wScroll > 400 ){
        $('[js-scrolltop]').addClass('is-visible');
      } else {
        $('[js-scrolltop]').removeClass('is-visible');
      }

      if ( scrollBottom > containerStop ){
        $('[js-scrolltop]').addClass('is-stop');
      } else {
        $('[js-scrolltop]').removeClass('is-stop');
      }
    }
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

      triggerBody(false);
    }
  })
  .on('click', '.property__tab-mobile', function(e){
    $(this).parent().toggleClass('is-active');
  })

  function benefitsTabFix(){
    $('.benefits__tab').each(function(i, tab){
      if ( !$(tab).is('.is-active') ){
        $(tab).hide();
      }
    })
  }

  function controlTabsMobileClass(){
    $('[js-remove-active-mobile]').each(function(i, el){
      var $el = $(el);

      if ( _window.width() < bp.mobile ){
        $el.removeClass('is-active');
      } else{
        $el.addClass('is-active');

        // we have removed all the tabs there
        // var dataTab = $el.data('tab');
        // var targetToggler = $('[data-target="'+dataTab+'"]');
        //
        // if ( targetToggler.is('.is-active') ){
        //   $el.siblings().removeClass('is-active');
        //   $el.addClass('is-active');
        //   // targetToggler.click();
        // }
      }
    })
  }


  //////////
  // SEARCH PAGE
  //////////
  _document
    .on('click', '[js-search-reset]', function(e){
      var form = $(this).closest('form');

      form.find('input[type="text"]').val('');
      form.find('input[type="radio"]').prop('checked', false);
      form.find('[js-rangeslider]').each(function(i, slider){
        slider.noUiSlider.reset();
      })
      $('[js-search-apply]').fadeOut();
    })
    .on('click', '[js-search-apply]', function(){
      $('[js-search-apply]').fadeOut();
      loadCards();
    })
    .on('change', '[js-search-filter]', function(){
      loadCards();
    })
    .on('change', '[js-search-form]', function(){
      $('[js-search-apply]').fadeIn();
    })
    .on('click', '.page-information__paragraph-head', function(){
      $(this).toggleClass('is-active');
      $(this).parent().find('.page-information__paragraph-drop').slideToggle();
    })

  function cardsLoaded(){
    setTimeout(function(){
      $('.h-card.is-loading').removeClass('is-loading')
    }, 1000)
  }
  function loadCards(){
    $('.h-card').addClass('is-loading');

    cardsLoaded();
  }


  //////////
  // PROPERTY PAGE
  //////////
  _document
    .on('click', '[js-open-share]', function(e){
      $('[js-open-share]').toggleClass('is-active');
      $('.property__share-drop').toggleClass('is-active')
    })
    .on('click', function(e){
      if ( !$(e.target).closest('.property__share').length > 0 ){
        $('[js-open-share]').removeClass('is-active');
        $('.property__share-drop').removeClass('is-active');
      }
    })
    .on('click', '[js-print]', function(e){
      window.print();
    })




  //////////
  // SLIDERS
  //////////

  function initSliders(printable){

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

    new Swiper('[js-slider-popular]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "popular__col",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 0,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true,
    })

    new Swiper('[js-slider-benefits]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "benefits__col",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 0,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true,
      on: {
        init: function () {
          setTimeout(benefitsTabFix, 200);
        },
      },
    })

    new Swiper('[js-slider-blog]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "blog__col",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 0,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true,
    })

    new Swiper('[js-slider-post]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "swiper-slide",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 0,
      slidesPerView: 1,
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: false,
      navigation: {
        nextEl: '.post__slider-next',
        prevEl: '.post__slider-prev',
      },
    })

    $('[js-hotCard-slider]').each(function(i, slider){
      new Swiper($(slider), {
        wrapperClass: "swiper-wrapper",
        slideClass: "h-card__image",
        direction: 'horizontal',
        nested: true,
        loop: true,
        watchOverflow: false,
        setWrapperSize: true,
        spaceBetween: 0,
        slidesPerView: 1,
        // effect: 'fade',
        normalizeSlideIndex: true,
        navigation: {
          nextEl: '.h-card__images-next',
          prevEl: '.h-card__images-prev',
        },
      })
    })


    new Swiper('[js-slider-categories]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "swiper-slide",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 0,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true,
    })

    new Swiper('[js-header-slider]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "header-search__slide",
      direction: 'horizontal',
      loop: true,
      autoplay: {
        delay: 3000,
      },
      watchOverflow: false,
      setWrapperSize: false,
      spaceBetween: 0,
      slidesPerView: 1,
      normalizeSlideIndex: true,
      // grabCursor: true,
      freeMode: false,
      navigation: {
        nextEl: '.header-search__next',
        prevEl: '.header-search__prev',
      },
    })


    var numberOfSlides = $('.gallery__main .gallery__main-slide').length;

    var gallerySwiper = new Swiper('[js-gallery-main]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "gallery__main-slide",
      direction: 'horizontal',
      nested: false,
      loop: true,
      loopedSlides: numberOfSlides,
      watchOverflow: false,
      setWrapperSize: true,
      spaceBetween: 0,
      slidesPerView: 1,
      touchEventsTarget: 'wrapper',
      // effect: 'fade',
      normalizeSlideIndex: true,
      navigation: {
        nextEl: '.gallery__main-next',
        prevEl: '.gallery__main-prev',
      },
    })

    var thumbsSwiper = new Swiper('[js-gallery-thumbs]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "gallery__thumbs-slide",
      direction: 'horizontal',
      nested: false,
      loop: true,
      loopedSlides: numberOfSlides,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 5,
      slidesPerView: 'auto',
      // effect: 'fade',
      normalizeSlideIndex: true,
      touchRatio: 0.2,
      slideToClickedSlide: true,
      navigation: {
        nextEl: '.gallery__thumbs-next',
        prevEl: '.gallery__thumbs-prev',
      },
    })

    if ( $('[js-gallery-main]').length > 0 ){
      gallerySwiper.controller.control = thumbsSwiper;
      thumbsSwiper.controller.control = gallerySwiper;

    }


    var slidePlan = new Swiper('[js-slider-plan]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "swiper-slide",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 0,
      slidesPerView: 2,
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: false,
      navigation: {
        nextEl: '.property__plan-next',
        prevEl: '.property__plan-prev',
      },
      breakpoints: {
        // when window width is <= 320px
        680: {
         slidesPerView: 1
        }
      }
    })

    if ( $('[js-slider-plan]').length > 0 ){
      if ( printable === true ){
        slidePlan.destroy();
      } else {
        slidePlan.update();
      }
    }


  }

  //////////
  // MODALS
  //////////

  function initPopups(){
    // Magnific Popup
    var startWindowScroll = 0;
    _document.on('click', '[js-popup]', function(e){
      var target = $(e.target).attr('href')
      $.magnificPopup.open({
        items: {
          src: target
        },
        type: 'inline',
        fixedContentPos: true,
        fixedBgPos: true,
        overflowY: 'auto',
        closeBtnInside: true,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'popup-buble',
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><svg class="ico ico-close"><use xlink:href="img/sprite.svg#ico-close"></use></svg></button>',
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
    })


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

    _document.on('click', '[js-popupVideo]', function(e){
      e.preventDefault();
      e.stopPropagation();
    })

    $('[js-popup-gallery]').magnificPopup({
  		delegate: '.gallery__main-slide:not(.swiper-slide-duplicate) a',
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

  _document.on('click', '.mfp-close', closeMfp);

  function closeMfp(){
    $.magnificPopup.close();
  }


  ////////////
  // TELEPORT PLUGIN
  ////////////
  function initTeleport(printable){
    $('[js-teleport]').each(function (i, val) {
      var self = $(val)
      var objHtml = $(val).html();
      var target = $('[data-teleport-target=' + $(val).data('teleport-to') + ']');
      var conditionMedia = $(val).data('teleport-condition').substring(1);
      var conditionPosition = $(val).data('teleport-condition').substring(0, 1);

      if (target && objHtml && conditionPosition) {

        function teleport(shouldPrint) {
          var condition;

          if (conditionPosition === "<") {
            condition = _window.width() < conditionMedia;
          } else if (conditionPosition === ">") {
            condition = _window.width() > conditionMedia;
          }

          if ( shouldPrint === true){
            target.html(objHtml)
            self.html('')
          } else {
            if (condition) {
              target.html(objHtml)
              self.html('')
            } else {
              self.html(objHtml)
              target.html("")
            }
          }

        }

        if ( printable == true ){
          teleport(printable);
        } else {
          teleport();
          _window.on('resize', debounce(function(){
            teleport(printable)
          }, 100));
        }

      }
    })
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
          var ps = new PerfectScrollbar(scrollbar, {
            suppressScrollX: xAvail,
            suppressScrollY: yAvail,
            wheelPropagation: true,
            minScrollbarLength: 20
          });

          // setTimeout(function(){
          //   $(scrollbar).find('[js-rangeslider]').each(function(i, range){
          //     range.noUiSlider.on('start', function( values, handle, unencoded, tap, positions ) {
          //       ps.destroy();
          //     })
          //     range.noUiSlider.on('change', function( values, handle, unencoded, tap, positions ) {
          //       ps = new PerfectScrollbar(scrollbar, {
          //         suppressScrollX: xAvail,
          //         suppressScrollY: yAvail,
          //         wheelPropagation: true,
          //         minScrollbarLength: 20
          //       });
          //     })
          //   })
          // }, 200)

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
        if ( !$(slider).is('.noUi-target')  ){
          var $slider = $(slider);
          var startFrom = $slider.data('start-from');
          var startTo = $slider.data('start-to');
          var step = $slider.data('step');
          var rangeMin = $slider.data('range-min');
          var rangeMax = $slider.data('range-max');

          noUiSlider.create(slider, {
            start: [startFrom, startTo],
            connect: true,
            step: step,
            behaviour: "tap",
            range: {
              'min': rangeMin,
              'max': rangeMax
            }
          });

          var priceValues = [
            $slider.parent().find('[js-range-from]').get(0),
            $slider.parent().find('[js-range-to]').get(0),
          ];

          slider.noUiSlider.on('update', function( values, handle ) {
            var isMaxed = parseInt(values[1]).toFixed(0) >= rangeMax ? " +" : ""
            priceValues[0].innerHTML = parseInt(values[0]).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            priceValues[1].innerHTML = parseInt(values[1]).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + isMaxed
            // priceValues[handle].innerHTML = parseInt(values[handle]).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + isMaxed

          });

          slider.noUiSlider.on('change', function( values, handle ) {
            if ( $slider.closest('form').length > 0 ){
              $slider.closest('form').trigger('change')
            }
          });

          slider.noUiSlider.on('end', function( values, handle ) {
            $slider.parent().parent().click();
            $slider.parent().parent().trigger('tap');
            $slider.focusout();
            triggerBody(false);
          });

        }
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

  // sticky kit
  function initSticky(){
    var sticky = $('[js-sticky]');

    if ( sticky.length > 0 ){
      sticky.each(function(i, el){
        $(el).stick_in_parent({
          offset_top: 75
        })

      })
    }
  }

  // selectric

  function initSelectric(){
    $('[js-selectric]').each(function(i, select){
      var icon = $(select).data('icon') || 'drop-arrow';
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
    $("[js-mask-number]").mask("999 999 999");

    _document
      .on('keydown', '[js-mask-price]', function(e){
        // https://stackoverflow.com/questions/22342186/textbox-mask-allow-number-only
        // Allow: backspace, delete, tab, escape, enter and .
        // dissallow . (190) for now
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
           // Allow: Ctrl+A
          (e.keyCode == 65 && e.ctrlKey === true) ||
           // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
             return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
        }
        if ( $(this).val().length > 10 ){
          e.preventDefault();
        }
      })
      .on('keyup', '[js-mask-price]', function(e){
        // if number is typed format with space
        if ($(this).val().length > 0){
          $(this).val( $(this).val().replace(/ /g,"") )
          $(this).val( $(this).val().replace(/\B(?=(\d{3})+(?!\d))/g, " ") );
        }
      })

  }

  function hookPrint(){
    var beforePrint = function() {
      initSliders(true);
      initScrollMonitor();
      initSticky();
      initTeleport(true);
      positionScrollTop();
      controlTabsMobileClass();
     };

     var afterPrint = function() {
       initTeleport();
       initSliders();
       triggerBody();
     };

     if (window.matchMedia) {
       var mediaQueryList = window.matchMedia('print');
       mediaQueryList.addListener(function(mql) {
         if (mql.matches) {
          beforePrint();
         } else {
          afterPrint();
         }
       });
     }

     window.onbeforeprint = beforePrint;
     window.onafterprint = afterPrint;
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
        scrollTop: 1,
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
  function triggerBody(shouldScroll){
    if ( shouldScroll ){
      _window.scrollTop(0);
    }
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

  function initMaps(){
    if ( $("#property-map").length > 0 ){
      ymaps.ready(init);
    }
    var myMap,
        myPlacemark;

    function init(){
        myMap = new ymaps.Map("property-map", {
            center: [55.76, 37.64],
            zoom: 12
        });

        myPlacemark = new ymaps.Placemark([55.76, 37.64], {
            hintContent: 'Москва!',
            balloonContent: 'Столица России'
        });

        myMap.geoObjects.add(myPlacemark);

        // ymaps.layout.storage.add('voina#icon', ymaps.templateLayoutFactory.createClass(
        //   '<div style="position: absolute; width: 28px; height: 36px; overflow: hidden;z-index: 0; ">' +
        //   '<div style="position:absolute;width:20px;height:20px;overflow:hidden;top:4px;left:4px">' +
        //   '<img src="/img/new_buttons_21.png" style="position:absolute;left:$[properties.iconOffset]px;"></div>' +
        //   '<img src="/img/buttons7.gif" style="position: absolute; left: -264px; top: -70px; "></div>'
        // ));
        //
        // ymaps.layout.storage.add('voina#cluster', ymaps.templateLayoutFactory.createClass(
        //   '<div style="position: absolute; margin: -26px 0 0 -26px; width: 58px; height: 58px; overflow: hidden;z-index: 0; ">' +
        //   '<div style="z-index:800;position: absolute; width: 58px; height: 58px; text-align: center; font-size: 13px; line-height: 58px;">$[properties.geoObjects.length]</div>' +
        //   '<img src="/img/cluster_big.png" style="position: absolute;"></div>'));
        //
        // console.log(myMap.panes.get('layers'))
        // var $container = myMap.panes.get('layers').getElement(),
        //
        //   stMapTypes = {
        //     'yandex#map': 'map',
        //     'yandex#satellite': 'sat',
        //     'yandex#hybrid': 'sat,ski',
        //     'yandex#publicMap': 'pmap'
        //   },
        //   center = myMap.getCenter(),
        //
        //   size = [650, 450],
        //
        //   mapUrl = 'http://static-maps.yandex.ru/1.x/?ll=' + center[1] + ',' + center[0] +
        //   '&z=' + myMap.getZoom() + '&l=' + stMapTypes[myMap.getType()] +
        //   '&size=' + size[0] + ',' + size[1];
        //
        // $('<div></div>').css({
        //   position: 'absolute',
        //   left: -Math.round(size[0] / 2) + 'px',
        //   top: -Math.round(size[1] / 2) + 'px',
        //   zIndex: 800
        // }).
        //
        // wrapInner($('<img>').attr({
        //   'src': mapUrl,
        //   width: size[0],
        //   height: size[1],
        //   border: '0'
        // })).
        //
        // prependTo($container);
        //
        // myMap.events.removeAll();
        //
        // var len = window.data.length;
        // if (len) {
        //   for (var i = 0, markers = [], properties, latLng; i < len; i++) {
        //     latLng = [parseFloat(window.data[i][1]), parseFloat(window.data[i][2])];
        //     markers.push(new ymaps.Placemark(latLng, {
        //       iconOffset: -window.data[i][5] * 20 - 1
        //     }, {
        //       iconLayout: 'voina#icon',
        //       iconOffset: [1, 2],
        //       openBalloonOnClick: false
        //     }));
        //   }
        //
        // }

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
    $("[js-validate-cb]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
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

        $(form).hide();
        $(form).parent().find('.cb__form-thanks').fadeIn();

      },
      rules: {
        name: "required",
        email: {
          required: true,
          email: true
        },
        message: "required"
      },
      messages: {
        name: "Заполните это поле",
        email: {
            required: "Заполните это поле",
            email: "Email содержит неправильный формат"
        },
        message: "Заполните это поле",
      }
    });

    $("[js-validate-subscribe]").validate({
      errorPlacement: function(error, element) {
        element.closest('.footer__subscribe').find('.ui-input__validation').remove();
        error.addClass('ui-input__validation');
        error.appendTo(element.closest('.footer__subscribe'));
      },
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
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

      },
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
