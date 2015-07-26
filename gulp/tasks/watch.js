'use strict';

var gulp = require('gulp');
var config = require('../config').watch;

gulp.task('watch', ['build', 'lint'], function() {
  gulp.watch(config.src, config.tasks);
});
