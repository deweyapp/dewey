var allTestFiles = [];
var TEST_REGEXP = /^\/base\/test\/unit\/.*(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  paths: {
    'underscore': 'bower_components/underscore/underscore',
    'angular': 'bower_components/angular/angular',
    'angular-route': 'bower_components/angular-route/angular-route',
    'angular-mocks': 'bower_components/angular-mocks/angular-mocks'
  },
  shim: {
    'underscore': {
      'exports' : '_'
    },
    'angular': {
      'exports' : 'angular'
    },
    'angular-route': ['angular'],
    'angular-mocks': {
      'deps':['angular', 'underscore'],
      'exports':'angular.mock'
    }
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
