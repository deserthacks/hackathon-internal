const gulp = require('gulp');
const gutil = require('gulp-util');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');


const SOURCES = [
  'src/styles/main.less',
];

const DESTINATION = 'build/hackathon-internal/';

const LESS_CONFIG = {
  paths: [
    'src/styles/',
    'node_modules/',
  ],
};


gulp.task('less', () => {
  const compiler = less(LESS_CONFIG);

  compiler.on('error', (error) => {
    gutil.log('[less]', error.toString());
    compiler.emit('end');
  });

  return gulp
    .src(SOURCES)
    .pipe(sourcemaps.init())
    .pipe(compiler)
    .pipe(rename('styles.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DESTINATION));
});


gulp.task('less:watch', () => {
  gulp.start('less');
  gulp.watch('src/styles/**/*.less', ['less']);
});
