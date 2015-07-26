var dest = "./dist";
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
    src: src + "/styles/**/*.{less,css}",
    dest: dest + "/styles",
    settings: {
      paths: []
    }
  },
  lint: {
    src: src + '/js/**/*.js'
  },
  browserify: {
    settings: {
      transform: ['6to5ify']
    },
    src: src + '/js/index.js',
    dest: dest + '/js',
    outputName: 'index.js',
  },
  html: {
    src: 'src/index.html',
    dest: dest
  },
  watch: {
    src: 'src/**/*.*',
    tasks: ['build']
  }
};
