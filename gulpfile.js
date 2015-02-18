var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var del         = require('del');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var merge       = require('merge-stream');
var reload      = browserSync.reload;

// basic path setting
var path = {
  assets : 'assets',
  tmp : '.tmp',
  build : 'build'
};

// clean
gulp.task('clean', function (cb) {
  del(path.tmp, cb);
});

// ejs
gulp.task('ejs', function() {
  return gulp.src([
    path.assets+'/templates/**/*.ejs',
    '!'+path.assets+'/templates/**/_*.ejs'
  ])
    .pipe($.ejs())
    .pipe(gulp.dest(path.tmp))
    .pipe(reload({stream:true}));
});

// js
gulp.task('js', function(){
  return gulp.src(path.assets+'/js/**/*.js')
    .pipe($.plumber())
    .pipe(gulp.dest(path.tmp+'/js/'))
    .pipe(reload({stream:true}));
});

// sass
gulp.task('sass', function(){
  return gulp.src(path.assets+'/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true
    }))
    .pipe(gulp.dest(path.tmp+'/css/'))
    .pipe(reload({stream:true}));
});

// sprite
gulp.task('sprite', function () {
  var spriteData = gulp.src(path.assets+'/img/sprites/*.png').pipe($.spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: '../img/sprite.png'
  }));
  return merge(
    spriteData.img.pipe(gulp.dest(path.tmp+'/img/')),
    spriteData.css.pipe(gulp.dest(path.assets+'/scss/var/'))
  );
});

// img
gulp.task('img', ['sprite'], function() {
  return gulp.src([
      path.assets+'/img/**',
      '!'+path.assets+'/img/sprites'
    ])
    .pipe(gulp.dest(path.tmp+'/img/'));
});

// clean:build
gulp.task('clean:build', function (cb) {
  del(path.build, cb);
});

// build-html
gulp.task('build-html', function() {
  var assets = $.useref.assets();

  return gulp.src(path.tmp+'/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest(path.build));
});

// img:build
gulp.task('img:build', function() {
  return gulp.src([
    path.tmp+'/img/**',
    '!'+path.tmp+'/img/sprites'
  ])
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(path.build+'/img/'))
    .pipe($.size({title: 'images'}));
});

// browser-sync
gulp.task("browser-sync", function() {
  browserSync({
    server: {
      baseDir: path.tmp
    }
  });
});

// watch
gulp.task('watch', ['browser-sync'], function(){
  gulp.watch([path.assets+'/**/*.ejs'], ['ejs']);
  gulp.watch([path.assets+'/js/**/*.js'], ['js']);
  gulp.watch([path.assets+'/scss/**/*.scss'], ['sass']);
});

// server
gulp.task('server', ['clean'], function() {
  runSequence(
    'img',
    ['ejs', 'js', 'sass','watch']
  );
});

// build
gulp.task('build', ['clean:build'], function() {
  runSequence(
    'img',
    ['ejs', 'js', 'sass'],
    ['build-html', 'img:build']
  );
});
