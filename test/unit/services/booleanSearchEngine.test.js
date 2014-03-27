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

	describe('When search "string" - will try to find a match in any object field.', function(){	
		it('', function(){
			expect(service).to.not.be.undefined;
		});
	});

	describe('When search "tag:string" - will try to find a match only in object tag property.', function(){
		it('', function(){
			expect(service).to.not.be.undefined;
		});
	});

	describe('When search "string1 tag:string2" - will try to find a match for search2 in object "tag" property an search1 title field.', function(){
		it('', function(){
			expect(service).to.not.be.undefined;
		});
	});
});

});