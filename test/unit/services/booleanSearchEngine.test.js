define(
[
  'angular',
  'angular-mocks',
  './../../../js/services/_module'
],
function(angular, mocks) {

describe('booleanSearchEngine.test.js', function() { 'use strict';
	
	var service;
	beforeEach(mocks.module('dewey.services'));

	beforeEach(inject(function (booleanSearchEngine) {
		service = booleanSearchEngine;
	}));

	it('Should have a filterBookmark function', function(){
		expect(service).to.not.be.undefined;
		expect(service.filterBookmark).to.be.a('function');
	});
});

});