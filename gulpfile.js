// include gulp
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var coffee = require('gulp-coffee');
var minifyHTML = require('gulp-minify-html');
var jasmine = require('gulp-jasmine');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var lr;

//JS hint task
gulp.task('jshint', function(){
  gulp.src('.src/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new or changed HTML pages
gulp.task('htmlpage', function() {
  var htmlSrc = './src/*.html',
      htmlDst = './build';
 
  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

gulp.task('js', ['coffee'],function(){
  gulp.src('./public/js/*.js')
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('coffee', function(){
  gulp.src('./src/coffee/*.coffee')
    .pipe(coffee({bare:false}).on('error', gutil.log))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('compile-test', function(){
  gulp.src('./src/spec/*.coffee')
    .pipe(coffee({bare:false}).on('error', gutil.log))
    .pipe(gulp.dest('./spec/'));
});

gulp.task('jasmine', ['compile-test'], function () {
  gulp.src('spec/main.js')
    .pipe(jasmine());
});

// Las siguientes funciones salieron de esta direccion:
// http://rhumaric.com/2014/01/livereload-magic-gulp-style/
var startLiveReload = function () {
  lr = require('tiny-lr')();
  lr.listen(35729);
}

var startExpress = function(){
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static('.'));
  app.listen(4000);
}

var notifyLiveReload = function (event) {
  var filename = require('path').relative('.', event.path);
  lr.changed({
    body:{
      files:[filename]
    }
  })
}


gulp.task('watch', function () {
  // Activa el web-server
  startExpress();
  // Activa el live-reload server
  startLiveReload();
  var coffeeWatcher = gulp.watch('src/coffee/*.coffee', ['coffee']);
  coffeeWatcher.on('change', function(event) {
    console.log('File '+event.path+' was '+event.type+', running "coffee" tasks...');
    // Notifica el cambio en algun archivo
    notifyLiveReload(event);
  });
  var indexWatcher = gulp.watch('index.html');
  indexWatcher.on('change', function(event) {
    console.log('File '+event.path+' was '+event.type+', reloading...');
    // Notifica el cambio en algun archivo
    notifyLiveReload(event);
  });
  var jasmineWatcher = gulp.watch('src/spec/*.coffee', ['compile-test']);
  jasmineWatcher.on('change', function(event) {
    console.log('File '+event.path+' was '+event.type+', running "jasmine" tasks...');
    // Notifica el cambio en algun archivo
    notifyLiveReload(event);
  });
})

gulp.task('default',['watch']);