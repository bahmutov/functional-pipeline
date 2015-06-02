/* global module */
module.exports = function (grunt) {
  module.require('time-grunt')(grunt);

  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    pkg: pkg,

    'nice-package': {
      all: {
        options: {
          blankLine: true
        }
      }
    },

    jshint: {
      'options': {
        jshintrc: '.jshintrc'
      },
      default: {
        'src': [ '*.js', 'test/*.js' ]
      }
    },

    sync: {
      all: {
        options: {
          sync: ['author', 'name', 'version',
            'private', 'license', 'keywords', 'homepage'],
        }
      }
    },

    concat: {
      options: {
        banner: '/**\n' +
          ' <%= pkg.name %>@<%= pkg.version %>\n' +
          ' <%= pkg.description %>\n' +
          ' <%= pkg.author %>\n' +
          ' <%= pkg.homepage %>\n' +
          '*/\n\n',
        process: grunt.template.process
      },
      fp: {
        src: ['fp.js'],
        dest: 'dist/fp.js'
      },
      fpDebug: {
        src: ['fp-debug.js'],
        dest: 'dist/fp-debug.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },

    'clean-console': {
      all: {
        options: {
          url: ['index.html'],
          timeout: 1
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: false,
        singleRun: true,
        logLevel: 'INFO',
        browsers: ['PhantomJS']
      }
    },

    watch: {
      options: {
        atBegin: true
      },
      all: {
        files: ['*.js', 'test/*.js', 'index.html'],
        tasks: ['jshint', 'test']
      }
    }
  });

  var plugins = module.require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['mochaTest', 'karma', 'clean-console']);
  grunt.registerTask('default', ['deps-ok', 'nice-package', 'sync', 'jshint', 'concat', 'test']);
};
