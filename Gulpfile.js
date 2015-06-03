var gulp = require('gulp'); 
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
 
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});
 
gulp.task('reload', function () {
  gulp.src(['./app/index.html', './app/views/*.html'])
    .pipe(connect.reload());
});

gulp.task('sass', function () {
  gulp.src('./app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
});
 
gulp.task('watch', function () {
  gulp.watch(['./app/**/*',], ['reload']);
  gulp.watch('./app/sass/**/*.scss', ['sass', 'reload']);
});
 
gulp.task('default', ['connect', 'watch']);
// gulp

gulp.task('copy-html-files', function() {
  gulp.src(['./app/**/*.html', '!./app/index.html'], {base: './app'})
  .pipe(gulp.dest('build/'));
});

gulp.task('usemin', function() {
  gulp.src('./app/index.html')
    .pipe(usemin({
      css: [minifyCss(), 'concat', rev()],
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('build', ['copy-html-files', 'usemin']);
// gulp build