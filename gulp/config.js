var dest = './dist';
var src = './src';

module.exports = {
  server: {
    settings: {
      root: dest,
      host: 'localhost',
      port: 8080,
      livereload: {
        port: 35929
      }
    }
  },
  less: {
    src: src + '/styles/**/*.{less,css}',
    dest: dest + '/styles',
    settings: {
      paths: []
    }
  },
  lint: {
    src: src + '/js/**/*.js'
  },
  browserify: {
    settings: {
      transform: ['babelify']
    },
    src: src + '/js/index.js',
    dest: dest + '/js',
    outputName: 'index.js',
  },
  html: {
    src: 'src/index.html',
    dest: dest
  },
  fonts: {
    src: './node_modules/bootstrap/dist/fonts/*.*',
    dest: dest + '/fonts'
  },
  watch: {
    src: 'src/**/*.*',
    tasks: ['build']
  }
};
