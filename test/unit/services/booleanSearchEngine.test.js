define(
[
  'angular',
  'angular-mocks',
  './../../../js/services/_module'
],
function(angular, mocks) {

describe('booleanSearchEngine.test.js', function() { 'use strict';
	
	var engine;
	beforeEach(mocks.module('dewey.services'));

	beforeEach(inject(function (booleanSearchEngine) {
		engine = booleanSearchEngine;
	}));

	it('Should have a filterBookmark function', function(){
		expect(engine).to.not.be.undefined;
		expect(engine.filterBookmark).to.be.a('function');
	});

	it('When search empty - result should be true', function(){
		var isFiltered = engine.filterBookmark(null, '');
		expect(isFiltered).to.be.true;
	});

	describe('When search "string" - will try to find a match in any object field.', function(){	
		var bookmark, searchText;
		
		beforeEach(function(){
			
			searchText = 'string';
			bookmark = {
				title: 'asdf QstringQ',
				url: 'http://127:0:0:1'
			};
		});

		it('When title contains string - result should be true', function(){			
			
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When title does not contain - result should be false', function(){
			
			searchText = 'notString';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});

		it('When url contains string - result should be true', function(){			
			
			searchText = ':0:0';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When url does not contain - result should be false', function(){
			
			searchText = ':1:0';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});
	});

	describe('When search "tag:string" - will try to find a match only in object tag property.', function(){
		it('', function(){
			expect(engine).to.not.be.undefined;
		});
	});

	describe('When search "string1 tag:string2" - will try to find a match for search2 in object "tag" property an search1 title field.', function(){
		it('', function(){
			expect(engine).to.not.be.undefined;
		});
	});
});

});