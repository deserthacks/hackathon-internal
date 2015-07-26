var jshint = require('gulp-jshint');
var gulp = require('gulp');
var config = require('../config').lint;

gulp.task('lint', function() {
  return gulp.src(config.src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
