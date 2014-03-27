define(
[
  'angular',
  'angular-mocks',
  './../../../js/services/_module'
],
function(angular, mocks) {

describe('booleanSearchEngine.test.js', function() { 'use strict';
  beforeEach(mocks.module('dewey.services'));

  it('Should be a function', function(){
	expect(true).to.equal(true);
  });
});

});