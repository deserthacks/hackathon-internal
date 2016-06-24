const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');

const CONFIG = {
  configFile: path.join(__dirname, '..', '.eslintrc'),
};

const SOURCES = [
  'gulpfile.js',
  'gulp/*.js',
  'src/js/**/*.js',
];


gulp.task('lint', () =>
  gulp.src(SOURCES)
    .pipe(eslint(CONFIG))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);
