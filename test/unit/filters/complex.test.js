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

  it('complex over 1000 bookmarks', mocks.inject(function($filter) {
    var complex = $filter('complex');
    var bookmarks = [];
    var i, result;

    console.time('Complex perf test');

    for (i = 1000; i < 2000; i ++) {
      bookmarks.push({
        title: 'Bookmark ' + i + ' title',
        url: 'http://' + i + '.example.com',
        tag: [ 
          { text: 'tag' + i, custom: false }, 
          { text: 'tag' + (i % 100), custom: false } 
        ]
      });
    }

    for (i = 1; i < 50; i++) {
      result = complex(bookmarks, 'tag:tag' + 50, 'url');
      expect(result).to.be.array;
      expect(result.length).to.equal(10);
    }

    for (i = 1; i < 50; i++) {
      result = complex(bookmarks, '50');
      expect(result).to.be.array;
      expect(result.length).to.equal(20);
    }

    console.timeEnd('Complex perf test');
  }));
});

});

