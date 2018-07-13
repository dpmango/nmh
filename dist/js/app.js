$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);
  var urlParams = {};

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
    defaultQuery();
    loadCards();

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
    parseQueryToVal();

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
  var lastScroll = 0;

  function disableScroll() {
    lastScroll = _window.scrollTop();
    $('.page__content').css({
      'margin-top': '-' + lastScroll + 'px'
    });
    $('body').addClass('body-lock');
  }

  function enableScroll() {
    $('.page__content').attr('style', '');
    $('body').removeClass('body-lock');
    _window.scrollTop(lastScroll)
    lastScroll = 0;
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
      if ( _window.width() <= bp.tablet ){

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
        // clear all first
        $('[js-hamburger]').removeClass('is-active');
        $('[js-open-header-search]').removeClass('is-active');
        $('.header').removeClass('is-menu-opened');
        $('.m-navi').removeClass('is-active');
        $('.m-search').removeClass('is-active');

        // toggle target elements
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
    $('[js-hamburger]').removeClass('is-active');
    $('[js-open-header-search]').removeClass('is-active');
    $('.header').removeClass('is-menu-opened');
    $('.m-navi').removeClass('is-active');
    $('.m-search').removeClass('is-active');

    blockScroll();
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
    // apply filters btn click
    // * REMOVED TO LIVE UPDATE
    // .on('click', '[js-search-apply]', function(){
    //   $('[js-search-apply]').fadeOut();
    //   loadCards();
    // })
    // filter change
    .on('change', '[js-search-filter]', function(){
      var queryName = $(this).closest('[js-query-builder]').data("query-name");
      addURLQuery(queryName, $(this).val())

      // loadCards();
    })
    .on('click', '[js-search-reset]', function(e){
      var form = $(this).closest('form');

      form.find('input[type="text"]').val('');
      form.find('input[type="radio"]').prop('checked', false);
      form.find('input[type="checkbox"]').prop('checked', false);
      form.find('[js-rangeslider]').each(function(i, slider){
        slider.noUiSlider.reset();
      })
      // $('[js-search-apply]').fadeOut();
      // loadCards();
      removeURLQuery(null, null, true);
    })
    // add query for the checkbox gruo
    .on('change', '[js-query-builder] input[type="checkbox"]', function(){
      var $this = $(this);
      var $groupContainer = $(this).closest('[js-query-builder]')
      var queryValues = [];
      $groupContainer.find('input[type="checkbox"]').each(function(i, checkbox){
        if ( $(checkbox).is(':checked') ){
          queryValues.push($(checkbox).val());
        }
      });

      var queryName = $groupContainer.data("query-name");
      addURLQuery(queryName, queryValues.join(";"))
      // loadCards();
    })

    // show button when something changed
    // CHANGED TO LIVE UPDATE
    // .on('change', '[js-search-form]', function(){
    //   // $('[js-search-apply]').fadeIn();
    // })

  _document
    // mobile toggler
    .on('click', '.page-information__paragraph-head', function(){
      if ( _window.width() <= 786 ){
        $(this).toggleClass('is-active');
        $(this).parent().find('.page-information__paragraph-drop').slideToggle();
      }
    })

  // loads properties from API
  function loadCards(){
    $('.h-card').addClass('is-loading');

    $gridContainer = $('.search__grid');
    var dataEndpoint = $gridContainer.closest('[data-properties-query-url]').data("properties-query-url");

    if ( $gridContainer.length > 0 && dataEndpoint ){
      var apiEndpoint = dataEndpoint + window.location.search // collect all params

      $.get(apiEndpoint)
        .done(function(res) {
          buildProperties(res);
          buildPagination(res);
        })
        .fail(function(err) {
          cardsLoaded();
          // show error?
        })
    }

    function buildProperties(res){
      var properties = res.items;
      var resultsHtml = "";

      if ( properties.length > 0 ){
        $.each(properties, function(index, item){

          var itemGallery = ""
          if ( item.carousel.length > 0 ){
            $.each(item.carousel, function(i, gal){
              if ( gal.url ){
                var embedVideo = '<i class="icon icon-play" href="'+gal.url+'" js-popupVideo></i>'
              }
              itemGallery += '<div class="h-card__image">' +
                  embedVideo +
                  '<img src="'+ gal.images[0] +'" srcset="'+ gal.images[1] +' 2x">' +
                '</div>'
            })
          }

          var itemMeta = "";
          if ( item.meta.length > 0 ){
            $.each(item.meta, function(i, meta){
              itemMeta += '<span>' + meta + '</span>'
            })
          }

          var pricePostfix = item.price.postfix !== undefined ? item.price.postfix : "";
          var pricePrefix = item.price.prefix !== undefined ? item.price.prefix : "";

          resultsHtml += '<div class="search__col">' +
            '<div class="h-card is-loading">' +
              '<div class="h-card__images swiper-wrapper" js-hotCard-slider>' +
                '<div class="swiper-wrapper">' +
                  itemGallery +
                '</div>' +
                '<div class="h-card__images-next">' +
                  '<svg class="ico ico-arrow-right">' +
                    '<use xlink:href="img/sprite.svg#ico-arrow-right"></use>' +
                  '</svg>' +
                '</div>' +
                '<div class="h-card__images-prev">' +
                  '<svg class="ico ico-arrow-left">' +
                    '<use xlink:href="img/sprite.svg#ico-arrow-left"></use>' +
                  '</svg>' +
                '</div>' +
              '</div>' +
              '<div class="h-card__content">' +
                '<div class="h-card__info"> ' + itemMeta + ' </div>' +
                '<a class="h-card__name" href="'+ item.url +'">'+ item.name +'</a>' +
                '<div class="h-card__addres">'+ item.address +'</div>' +
                '<div class="h-card__price">' +
                  (pricePrefix ? '<span>' + pricePrefix + '</span>' : "") +
                  item.price.value +
                  '<span>' + pricePostfix + '</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>'
        });

        // reset and append
        $gridContainer.html("");
        $gridContainer.append(resultsHtml);

      }
    }

    cardsLoaded();
  }

  function cardsLoaded(){
    setTimeout(function(){
      initSliders();
      initPopups();
      $('.h-card.is-loading').removeClass('is-loading')
    }, 500)
  }

  function buildPagination(res){
    var pages = res.pages;
    var count = res.count;
    var resultsHtml = "";
    var $paginationContainer = $('[js-pagination]');

    if ( pages && count ){
      var linksHtml = "";
      var linksArr = pagination(pages.active, pages.count);

      $.each(linksArr, function(i, val){
        if ( val !== "..." ){
          linksHtml += '<li class="'+ ( val === pages.active ? "is-active" : "" ) +'" data-page="'+val+'"><a href="#">'+ val +'</a></li>'
        } else {
          linksHtml += '<li class="pagination__break">' +
            '<svg class="ico ico-pagination-break">' +
              '<use xlink:href="img/sprite.svg#ico-pagination-break"></use>' +
            '</svg>' +
          '</li>'
        }
      })

      var countHtml = res.from + "-" + res.to;

      resultsHtml += '<div class="pagination__scope">'+countHtml+' из '+count+'</div>' +
        '<div class="pagination__list" js-pagination>' +
          linksHtml +
        '</div>'

      // reset and append
      $paginationContainer.html("");
      $paginationContainer.append(resultsHtml);

      // detect break with delta
      // https://gist.github.com/kottenator/9d936eb3e4e3c3e02598
      function pagination(c, m) {
        var current = c,
            last = m,
            delta = 1,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;
        for (var i = 1; i <= last; i++) {
          if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
          }
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = range[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _i = _step.value;

            if (l) {
              if (_i - l === 2) {
                rangeWithDots.push(l + 1);
              } else if (_i - l !== 1) {
                rangeWithDots.push('...');
              }
            }
            rangeWithDots.push(_i);
            l = _i;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return rangeWithDots;
      }

    }
  }


  // PAGINATION
  _document.on('click', '[js-pagination] li', function(){
    var targetPage = $(this).data("page");
    addURLQuery("page", targetPage);
    // loadCards();
  })

  // PARSE QUERY
  function parseQueryToVal(){
    // check all params first

    var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = window.location.search.substring(1);

    while (match = search.exec(query)){
      urlParams[decode(match[1])] = decode(match[2]);
    }

    console.log('urlParams', urlParams)

    //find select by a checbox
    $.each(urlParams, function(key, val){
      var targetQuerySearch = key;
      if ( key.indexOf('-min') !== -1 ){
        // no need to check for max as it's linked
        targetQuerySearch = targetQuerySearch.slice(0, -4);
      }

      var $target = $('[data-query-name="'+targetQuerySearch+'"]');

      // sliders
      if ( $target.is('.slider-group') ){
        var $sliders = $target.find('[js-rangeslider]');

        setTimeout(function(){
          $sliders.each(function(i, slider){
            slider.noUiSlider.set([
              urlParams[targetQuerySearch+'-min'],
              urlParams[targetQuerySearch+'-max'],
            ])
          })
        }, 300)

        return
      }

      // checkboxes
      if ( $target.is('.ui-group') ){
        var checkBoxValues = urlParams[targetQuerySearch].split(';');
        var $checkBoxes = $target.find("input[type='checkbox']");

        $checkBoxes.each(function(i, checkbox){
          var $checkbox = $(checkbox);

          if ( checkBoxValues.indexOf( $checkbox.val() ) !== -1 ){
            $checkbox.attr("checked", true)
          }
        })

        return
      }

      // order by - select
      if ( $target.is('.search__filter-select') ){
        setTimeout(function(){
          var $select = $target.find("[js-selectric]");
          var $selectValues = $select.find('option');
          var targetIndex;

          $selectValues.each(function(i, option){
            if ( $(option).val() === urlParams[targetQuerySearch] ){
              targetIndex = $(option).index();
            }
          })

          $select.prop('selectedIndex', targetIndex).selectric('refresh')
        }, 300);
        return
      }

      // tags
      if ( key.indexOf('tag-') !== -1 ){
        var tagQueryName = key.split('tag-')[1]
        var tagQueryVal = urlParams[key]

        var $containers = $('[js-search-container]');

        $containers.each(function(i, container){
          var $container = $(container);

          $.get('/json/api-tags.json?q='+tagQueryName+'' + tagQueryVal)
            .done(function(res) {
              var tagLabel;

              $.each(res.tags, function(i, tag){
                if ( tag.name === ("tag-" + tagQueryName) && tag.value === tagQueryVal ){
                  tagLabel = tag.label
                  var createdElement = '<div data-query-name="tag-'+tagQueryName+'" data-query-value="'+tagQueryVal+'" class="s-hint-suggestion"> <span>'+ tagLabel +'</span>' +
                    '<svg class="ico ico-close">' +
                      '<use xlink:href="img/sprite.svg#ico-close"></use>' +
                    '</svg>' +
                  '</div>';

                  $container.find('[js-search-tags]').append(createdElement);
                  $container.addClass('is-active');

                  fixMobileOffset($container)
                }
              });
            })
            .fail(function(err) {
              console.log(err);
            })
        })

      }
    })
  }

  // default query
  function defaultQuery(){
    if ( window.location.search === "" ){
      var defaultQueryData = $('[js-default-query]').data("query")
      if ( defaultQueryData ){
        window.history.replaceState({}, null, window.location.pathname + defaultQueryData);
      }
    }
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
      // autoHeight: true,
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
          var wheelPropagation = $(scrollbar).data('propagation') !== undefined ? false : true; // true is default
          var ps = new PerfectScrollbar(scrollbar, {
            suppressScrollX: xAvail,
            suppressScrollY: yAvail,
            wheelPropagation: wheelPropagation,
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

            // query builder
            var $queryContainer = $slider.closest('[js-query-builder]');
            if ( $queryContainer.length > 0 ){
              var queryName = $queryContainer.data("query-name");
              var isRangeQuery = $queryContainer.data("query-min-max");

              if ( queryName && isRangeQuery == true){
                addURLQuery(queryName + "-min", Math.floor(values[0])); // min
                addURLQuery(queryName + "-max", Math.floor(values[1])); // max
                // loadCards();
              }
            }

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

  ///////////////
  // SEARCH HINTS
  ///////////////
  _document
    .on("keyup", '[js-search-hints]', debounce(function(e){
      e.preventDefault();
      e.stopPropagation();

      // enter is reserved for selecting first child
      if ( e.keyCode === 13 ) return

      var postValue = $(this).val();
      var $sContainer = $(this).closest('[js-search-container]');
      var requestEndpoint = $sContainer.data("url");
      var $hintContainer = $sContainer.find('.s-hints');

      // 3 symbols are minimum
      if ( postValue.length <= 2 ) {
        $hintContainer.removeClass("is-active").removeClass('is-loaded');
        return
      }

      // show box straightaway and clear past results if any
      resetContainer();
      $hintContainer.addClass('is-active').removeClass('is-loaded');
      setMaxHeight($hintContainer);

      // add .is-loaded when API responce is done and results (or no res) are rendered
      // add .is-active when showing container with preloader

      // !!! TODO !!!
      // can't get dynamic ?q=value with static json
      // please manage this yourself with real data
      // should be single query
      // buildHintsNoResults or buildHints respectively
      if ( postValue.match("^нет") ){
        // render no results
        $.get('/json/api-hints-blank.json?q='+postValue+'')
          .done(function(res) {
            buildHintsNoResults(res);
          })
          .fail(function(err) {
            $hintContainer.removeClass("is-active").removeClass('is-loaded');
            console.log(err);
          })
        return
      }

      // when results are found
      $.get(requestEndpoint + '?q=' + postValue )
        .done(function(res) {
          buildHints(res);
        })
        .fail(function(err) {
          $hintContainer.removeClass("is-active").removeClass('is-loaded');
          console.log(err);
        })

      // END TODO

      // BUILDER FUNCTIONS
      function buildHints(res){
        var tags = res.tags;
        var properties = res.items;
        var resultsHtml = "";

        // iterate through tags
        if ( tags.length > 0 ){
          $.each(tags, function(i, tag){
            var itemsListHtml = ""; // collect list html;
            $.each(tag.items, function(index, item){
              itemsListHtml += '<li js-add-hint-tag data-query-value="'+ item.value +'"><a href="#">'+ item.label +'</a></li>';
            })

            // build result string
            resultsHtml += '<!-- section  -->' +
            '<div class="s-hints__section" data-query-name="'+ tag.name +'">' +
              '<div class="s-hints__section-name">'+ tag.title +'</div>' +
              '<ul class="s-hints__list">' +
                itemsListHtml +
              '</ul>' +
            '</div>'
          })
        }

        // iterate through properties
        if ( properties.length > 0 ){
          var propertiesListHtml = ""; // collect porperties list html

          $.each(properties, function(i, property){
            var pricePostfix = property.price.postfix !== undefined ? property.price.postfix : "";
            var pricePrefix = property.price.prefix !== undefined ? property.price.prefix : "";

            propertiesListHtml += '<li><a class="s-hints-property" href="'+ property.url +'" target="_blank">' +
              '<div class="s-hints-property__image">' +
                '<img src="'+ property.images[0] +'" srcset="'+ property.images[1] +' 2x">' +
              '</div>' +
              '<div class="s-hints-property__content">' +
                '<div class="s-hints-property__id">ID '+ property.id +'</div>' +
                '<div class="s-hints-property__name">'+ property.name +'</div>' +
                '<div class="s-hints-property__price">'+
                  (pricePrefix ? '<span>' + pricePrefix + '</span>' : "") +
                  property.price.value +
                  ' <span>' + pricePostfix + '</span>' +
                '</div>' +
              '</div></a>' +
            '</li>';

            if ( i === properties.length - 1 ){
              onListEnd();
            }

          });

          function onListEnd(){
            // build results string
            resultsHtml += '<div class="s-hints__section">' +
              '<div class="s-hints__section-name">Объекты недвижимости</div>' +
              '<ul class="s-hints__list">' +
                propertiesListHtml +
              '</ul>' +
            '</div>'
          }
        }

        // append results
        setTimeout(function(){
          // emulate api delay
          resetContainer(); // just in case if debounce timings is not matched
          appendResults(resultsHtml);
        }, 1000)

      } // end buildHints

      function buildHintsNoResults(res){
        var suggestions = res.suggestions;
        var resultsHtml = "";

        // iterate through suggestions
        if ( suggestions.length > 0 ){
          var suggestionsListHtml = ""; // collect list html

          $.each(suggestions, function(i, suggestion){

            suggestionsListHtml += '<div class="s-hint-suggestion" data-query-name="'+ suggestion.name +'" data-query-value="'+ suggestion.value +'">'+
              suggestion.label +
            '</div>';

            if ( i === suggestions.length - 1 ){
              onListEnd();
            }

          });

          function onListEnd(){
            // build results string
            resultsHtml += '<div class="s-hints__no-results">' +
              '<div class="s-hints__no-results-text">К сожалению поиск не дал результатов. Попробуйте, например, добавить:</div>' +
              '<div class="s-hints__no-results-suggestions">' +
                suggestionsListHtml +
              '</div>' +
            '</div>'
          }
        }

        // append results
        setTimeout(function(){
          // emulate api delay
          resetContainer(); // just in case if debounce timings is not matched
          appendResults(resultsHtml);
        }, 1000)

      } // end buildHintsNoResults


      // helper functions reset/append
      function resetContainer(){
        $hintContainer.find('.s-hints__section').remove();
        $hintContainer.find('.s-hints__no-results').remove();
      }

      function appendResults(str){
        $hintContainer.find('.s-hints__wrapper').append(str);
        $hintContainer.addClass('is-loaded');
      }

      // set max height to prevent forcing user to scroll down
      function setMaxHeight(el){
        var targetWrapper = el.find('.s-hints__wrapper');
        var targetOffset = targetWrapper[0].getBoundingClientRect().top
        var wHeight = _window.height();

        targetWrapper.css({
          'max-height': (wHeight - targetOffset - 10)+ 'px'
        })
      }


    }, 200)) // end keyup
    .on('click', '[js-close-hints]', function(){
      // close hints
      $(this).closest('.s-hints')
        .removeClass('is-active')
        .removeClass('is-loaded');
    })
    .on('click', function(e){
      if (
        !$(e.target).closest('.header-search').length > 0 ||
        !$(e.target).closest('.search-form').length > 0
      ){
        $('.s-hints')
          .removeClass('is-active')
          .removeClass('is-loaded');
      }
    })

    // SEARCH TAGS
    .on('click', '[js-add-hint-tag]', function(e){
      var $tag = $(this);
      var $sContainer = $(this).closest('[js-search-container]');
      var qValue = $tag.data("query-value");
      var qName = $tag.closest("[data-query-name]").data("query-name");
      var tagLabel = $tag.find("a").html();

      // search for dublicates
      var $currentTags = $sContainer.find('[js-search-tags]')
      if ( $currentTags.find('[data-query-value="'+qValue+'"]').length > 0
            && $currentTags.find('[data-query-name="'+qName+'"]').length > 0
      ){
        return
      }

      var createdElement = '<div data-query-name="'+qName+'" data-query-value="'+qValue+'" class="s-hint-suggestion"> <span>'+ tagLabel +'</span>' +
        '<svg class="ico ico-close">' +
          '<use xlink:href="img/sprite.svg#ico-close"></use>' +
        '</svg>' +
      '</div>';

      $('[js-search-tags]').append(createdElement);
      // $('[js-search-apply]').fadeIn(); // show apply btn if any
      $sContainer.find('[js-search-hints]').val(""); // reset input
      // loadCards();
      addURLQuery(qName, qValue);
      showResetBtn($tag);

      fixMobileOffset($sContainer);
    })
    // remove hint on click (in sContainer)
    .on('click', '.s-hint-suggestion .ico-close', function(){
      $(this).parent().fadeOut(250, function(){
        var $tag = $(this);
        var $sContainer = $(this).closest('[js-search-container]')
        var qValue = $tag.data("query-value");
        var qName = $tag.closest("[data-query-name]").data("query-name");

        removeURLQuery(qName, null)
        $(this).remove();
        fixMobileOffset($sContainer)

        // reset if no active tags there
        if ( $sContainer.find('.s-hint-suggestion').length === 0 ) {
          $sContainer.removeClass('is-active');
        }
      })
    })
    // select first tag on enter
    .on('keydown', '[js-search-hints]', function(e){
      if ( e.keyCode === 13 ){
        var $sContainer = $(this).closest('[js-search-container]');
        var $firstTag = $sContainer.find('.s-hints__list li a').first();
        $firstTag.click();
      }
    })

    // RESET SEARCH
    .on('click', '[js-search-reset]', function(){
      var $sContainer = $(this).closest('[js-search-container]');
      var $tags = $sContainer.find('[js-search-tags]');
      var $input = $sContainer.find('[js-search-hints]');

      $sContainer.removeClass('is-active');
      $tags.html(""); // remove tags
      $input.trigger("keyup");
      $input.val(""); // remove input val

      removeURLQuery(null, null, true);
      fixMobileOffset($sContainer)
    })

  function showResetBtn(el){
    // TODO
    el.closest('[js-search-container]').addClass('is-active');
  }

  function fixMobileOffset(container){
    var $target
    if ( container.is('.hints--with-bg') ){
      $target = $('.search-form__name');
      if ( _window.width() <= 992 ){
        var addHeight = 15 + container.find('.hints__suggestions').height() - 6;
        if ( addHeight < 15 ){ addHeight = 15 } // at least 15
        $target.css({ 'margin-bottom': addHeight });
      } else {
        $target.css({ 'margin-bottom': 0 });
      }
    // topbar
    } else {
      $target = $('.search')

      if ( _window.width() <= 768 ){
        var addHeight = 125 + container.height() - 40;
        $target.css({ 'margin-top': addHeight });
      } else {
        $target.attr('style', '')
      }

    }
  }

  _window.on('resize', debounce(function(){
    if ( _window.width() > 768 ){
      $('.search').attr('style', '')
    }

    if ( _window.width() > 992 ){
      $('.search-form__name').css({
        'margin-bottom': 0
      });
    }
  }, 200));


  // QUERY BUILDER
  function addURLQuery(name, value){
    // name is a (category)
    // value is a (param)
    window.history.replaceState({}, null, UpdateQueryString(name, value));
    // console.log(window.location.search) // debug
    loadCards();
  }

  function removeURLQuery(name, value, clear){
    if ( clear ){
      window.history.replaceState({}, null, window.location.pathname);
    } else {
      window.history.replaceState({}, null, UpdateQueryString(name, null));
    }
    loadCards();
  }


  // Not supplying a value will remove the parameter
  // supplying one will add/update the parameter.
  // If no URL is supplied, it will be grabbed from window.location
  function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
      hash;

    if (re.test(url)) {
      if (typeof value !== 'undefined' && value !== null)
        return url.replace(re, '$1' + key + "=" + value + '$2$3');
      else {
        hash = url.split('#');
        url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
        if (typeof hash[1] !== 'undefined' && hash[1] !== null)
          url += '#' + hash[1];
        return url;
      }
    } else {
      if (typeof value !== 'undefined' && value !== null) {
        var separator = url.indexOf('?') !== -1 ? '&' : '?';
        hash = url.split('#');
        url = hash[0] + separator + key + '=' + value;
        if (typeof hash[1] !== 'undefined' && hash[1] !== null)
          url += '#' + hash[1];
        return url;
      } else
        return url;
    }
  }


  // PRINT HOOK
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
      if ( $(window).width() <= 768 ){
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

// SERVICE FUNCTIONS
// PROTOTYES and EXTENDS
$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});
