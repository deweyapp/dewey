define(
[
  'angular',
  'angular-mocks',
  './../../../js/filters/_module'
],
function(angular, mocks) {

describe('complex.test.js', function() { 'use strict';
  beforeEach(mocks.module('dewey.filters'));

  it('Should be a function', mocks.inject(function($filter) {
    expect($filter('complex')).to.be.a('function');
  }));
});

});

