var gulp        = require('gulp');
var path        = require('path');
var util        = require('gulp-util');
var plumber     = require('gulp-plumber');
var concat      = require('gulp-concat');
var uglifyJs    = require('gulp-uglify');
var config      = require('../config');

gulp.task('javascript:vendor', function() {
  return gulp.src([
      path.resolve('bower_components', 'jquery/dist/jquery.min.js'),
      path.resolve('bower_components', 'svg4everybody/dist/svg4everybody.min.js'),
      path.resolve('bower_components', 'viewport-units-buggyfill/viewport-units-buggyfill.js'),
      path.resolve('bower_components', 'swiper/dist/js/swiper.min.js'),
      path.resolve('bower_components', 'magnific-popup/dist/jquery.magnific-popup.min.js'),
      path.resolve('bower_components', 'scrollMonitor/scrollMonitor.js'),
      path.resolve('bower_components', 'jquery-validation/dist/jquery.validate.min.js'),
      path.resolve('bower_components', 'jquery-mask-plugin/dist/jquery.mask.min.js'),
      path.resolve('bower_components', 'barba.js/dist/barba.min.js'),
      path.resolve('bower_components', 'jquery-lazy/jquery.lazy.min.js'),
      path.resolve('bower_components', 'animejs/anime.min.js'),
      path.resolve('bower_components', 'easyAutocomplete/dist/jquery.easy-autocomplete.min.js'),
      config.src.js + '/vendor/**/*.js'
     ])
    .pipe(plumber({ errorHandler: config.errorHandler }))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(config.dest.js));
});

gulp.task('javascript:vendor:min', function() {
  return gulp.src([
      path.resolve('bower_components', 'jquery/dist/jquery.min.js'),
      path.resolve('bower_components', 'svg4everybody/dist/svg4everybody.min.js'),
      path.resolve('bower_components', 'viewport-units-buggyfill/viewport-units-buggyfill.js'),
      path.resolve('bower_components', 'swiper/dist/js/swiper.min.js'),
      path.resolve('bower_components', 'magnific-popup/dist/jquery.magnific-popup.min.js'),
      path.resolve('bower_components', 'scrollMonitor/scrollMonitor.js'),
      path.resolve('bower_components', 'jquery-validation/dist/jquery.validate.min.js'),
      path.resolve('bower_components', 'jquery-mask-plugin/dist/jquery.mask.min.js'),
      path.resolve('bower_components', 'barba.js/dist/barba.min.js'),
      path.resolve('bower_components', 'jquery-lazy/jquery.lazy.min.js'),
      path.resolve('bower_components', 'animejs/anime.min.js'),
      path.resolve('bower_components', 'easyAutocomplete/dist/jquery.easy-autocomplete.min.js'),
      config.src.js + '/vendor/**/*.js'
     ])
    .pipe(plumber({ errorHandler: config.errorHandler }))
    .pipe(concat('vendor.min.js'))
    .pipe(uglifyJs())
    .pipe(gulp.dest(config.dest.js));
});

gulp.task('javascript:app', function() {
  return gulp.src([
      config.src.js + '/*.js'
     ])
    .pipe(plumber({ errorHandler: config.errorHandler }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(config.dest.js));
});

gulp.task('javascript:app:min', function() {
  return gulp.src([
      config.src.js + '/*.js'
     ])
    .pipe(plumber({ errorHandler: config.errorHandler }))
    .pipe(concat('app.min.js'))
    .pipe(uglifyJs())
    .pipe(gulp.dest(config.dest.js));
});

gulp.task('javascript', [
  'javascript:vendor',
  'javascript:vendor:min',
  'javascript:app',
  'javascript:app:min'
]);

gulp.task('javascript:watch', function() {
  gulp.watch(config.src.js + '/vendor/**/*.js', ['javascript:vendor', 'javascript:vendor:min']);
  gulp.watch(config.src.js + '/*.js', ['javascript:app', 'javascript:app:min']);
});
