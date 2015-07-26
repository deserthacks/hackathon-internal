var gulp = require('gulp');
var connect = require('gulp-connect');
var config = require('../config.js').less;
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

gulp.task('styles', function () {
  return gulp.src(config.src)
    .pipe(less(config.settings))
    .pipe(minifyCSS())
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
});
