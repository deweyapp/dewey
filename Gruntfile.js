module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {      
      options: {
      },
      app: [
        'background.js',
        'js/**/*.js',
        '!js/lib/*'
      ],
      tests: {
        // suppress chai asserts
        options: {
          expr: true
        },
        src: [ 'test/**/*.js' ]
      },
      other: {
        options: {
          node: true
        },
        files: {
          src: ['Gruntfile.js']
        }
      }
    },

    // Tests
    karma: {
      unit: {
        configFile: './test/unit.conf.js'
      },
      chrome: {
        configFile: './test/unit.conf.js',
        browsers: ['Chrome'],
        singleRun: false,
        autoWatch: true,
        reporters: ['progress', 'mocha']
      }
    },

    // Development
    watch: {
      dev: {
        files: ['js/**/*.js', 'test/**/*.js'],
        tasks: ['jshint', 'karma:unit']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('test', ['jshint', 'karma:unit']);
  grunt.registerTask('chrome', ['karma:chrome']);
};