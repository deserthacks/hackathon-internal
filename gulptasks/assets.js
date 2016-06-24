const gulp = require('gulp');
const { dependencies } = require('../package.json');


gulp.task('assets', () => {
  const version = dependencies['font-awesome'];
  gulp.src('node_modules/font-awesome/fonts/**')
    .pipe(gulp.dest(`build/${version}/fonts/font-awesome/`));
});
