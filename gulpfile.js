// Grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    bower = require('gulp-bower'),
    merge = require('merge-stream');
    
// Compile Sass, Autoprefix and minify
gulp.task('styles', function() {
  var places = ['./src/assets/scss/*.scss', './src/assets/scss/style.scss'];

  var tasks = places.map(function(element) {
      if ( element === './src/assets/scss/style.scss' ) {
          return gulp.src('./src/assets/scss/style.scss')
              .pipe(sass({includePaths: ['./node_modules/foundation-sites/scss']}).on('error', sass.logError))
              .pipe(gulp.dest(''))
      } else {
          return gulp.src('./src/assets/scss/*.scss')
              .pipe(sass({includePaths: ['./node_modules/foundation-sites/scss']}).on('error', sass.logError))
              .pipe(gulp.dest('./src/assets/css/'))
      }
  });

  return merge(tasks);
});    
    
// JSHint, concat, and minify JavaScript
gulp.task('site-js', function() {
  return gulp.src([	
	  
           // Grab your custom scripts
  		  './assets/js/scripts/*.js'
  		  
  ])
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js'))
});    

// JSHint, concat, and minify Foundation JavaScript
gulp.task('foundation-js', function() {
  return gulp.src([	
  		  
  		  // Foundation core - needed if you want to use any of the components below
          './vendor/foundation-sites/js/foundation.core.js',
          './vendor/foundation-sites/js/foundation.util.*.js',
          
          // Pick the components you need in your project
          './vendor/foundation-sites/js/foundation.abide.js',
          './vendor/foundation-sites/js/foundation.accordion.js',
          './vendor/foundation-sites/js/foundation.accordionMenu.js',
          './vendor/foundation-sites/js/foundation.drilldown.js',
          './vendor/foundation-sites/js/foundation.dropdown.js',
          './vendor/foundation-sites/js/foundation.dropdownMenu.js',
          './vendor/foundation-sites/js/foundation.equalizer.js',
          './vendor/foundation-sites/js/foundation.interchange.js',
          './vendor/foundation-sites/js/foundation.magellan.js',
          './vendor/foundation-sites/js/foundation.offcanvas.js',
          './vendor/foundation-sites/js/foundation.orbit.js',
          './vendor/foundation-sites/js/foundation.responsiveMenu.js',
          './vendor/foundation-sites/js/foundation.responsiveToggle.js',
          './vendor/foundation-sites/js/foundation.reveal.js',
          './vendor/foundation-sites/js/foundation.slider.js',
          './vendor/foundation-sites/js/foundation.sticky.js',
          './vendor/foundation-sites/js/foundation.tabs.js',
          './vendor/foundation-sites/js/foundation.toggler.js',
          './vendor/foundation-sites/js/foundation.tooltip.js',
  ])
    .pipe(concat('foundation.js'))
    .pipe(gulp.dest('./assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js'))
});

// Update Foundation with Bower and save to /vendor
gulp.task('bower', function() {
  return bower({ cmd: 'update'})
    .pipe(gulp.dest('vendor/'))
});    

// Create a default task 
gulp.task('default', function() {
  gulp.start('styles', 'site-js', 'foundation-js');
});

// Watch files for changes
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('./assets/scss/**/*.scss', ['styles']);

});
