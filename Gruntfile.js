module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {      
      options: {
      },
      app: [
        'js/**/*.js',
        '!js/lib/*'
      ],
      other: {
        options: {
          node: true
        },
        files: {
          src: ['Gruntfile.js']
        }
      }
    },

    // Development
    watch: {
      dev: {
        files: ['js/**/*.js'],
        tasks: ['jshint']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('test', ['jshint']);
};