define(
[
  'angular',
  'angular-mocks',
  './../../../js/services/_module'
],
function(angular, mocks) {

describe('exporter.test.js', function() { 'use strict';

    var engine;
    beforeEach(mocks.module('dewey.services'));

    beforeEach(inject(function (exporter) {
        engine = exporter;
    }));

    it('Should have a exportToNetscape function', function(){
        expect(engine).to.not.be.undefined;
        expect(engine.exportToNetscape).to.be.a('function');
    });

    describe('exportToNetscape:', function(){

        it('When bookmarks collection is null - result should contains only header and footer', function(){

            var expected = '<!DOCTYPE NETSCAPE-Bookmark-file-1><!-- This is an automatically generated file.It will be read and overwritten.DO NOT EDIT! --><META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8"><TITLE>Bookmarks</TITLE><H1>Bookmarks</H1><DL><p></DL><p>';

            var result = engine.exportToNetscape(null);
            expect(result).to.equal(expected);
        });

        it('When bookmarks collection is empty - result should contains only header and footer', function(){

            var expected = '<!DOCTYPE NETSCAPE-Bookmark-file-1><!-- This is an automatically generated file.It will be read and overwritten.DO NOT EDIT! --><META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8"><TITLE>Bookmarks</TITLE><H1>Bookmarks</H1><DL><p></DL><p>';

            var result = engine.exportToNetscape(null);
            expect(result).to.equal(expected);
        });

        describe('When bookmarks collection is not empty', function(){

            it('and NO tags - result should contains two bookmarks', function(){

                var expected = '<!DOCTYPE NETSCAPE-Bookmark-file-1><!-- This is an automatically generated file.It will be read and overwritten.DO NOT EDIT! --><META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8"><TITLE>Bookmarks</TITLE><H1>Bookmarks</H1><DL><p><DT><A HREF="http://underscorejs.org/" ADD_DATE="1394679060712" TAGS="">Underscore.js</A><DT><A HREF="https://github.com/" ADD_DATE="1396299213543" TAGS="">GitHub</A></DL><p>';

                var result = engine.exportToNetscape([
                    {
                        date: 1394679060712,
                        id: '7',
                        title: 'Underscore.js',
                        url: 'http://underscorejs.org/',
                        tag: []
                    },
                    {
                        date: 1396299213543,
                        id: '20',
                        title: 'GitHub',
                        url: 'https://github.com/',
                        tag: []
                    }
                ]);
                expect(result).to.equal(expected);
            });

            it('and NO tags - result should contains two bookmarks', function(){

                var expected = '<!DOCTYPE NETSCAPE-Bookmark-file-1><!-- This is an automatically generated file.It will be read and overwritten.DO NOT EDIT! --><META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8"><TITLE>Bookmarks</TITLE><H1>Bookmarks</H1><DL><p><DT><A HREF="http://underscorejs.org/" ADD_DATE="1394679060712" TAGS="Other Bookmarks">Underscore.js</A><DT><A HREF="https://github.com/" ADD_DATE="1396299213543" TAGS="Bookmarks Bar,prog">GitHub</A></DL><p>';

                var result = engine.exportToNetscape([
                    {
                        date: 1394679060712,
                        id: '7',
                        title: 'Underscore.js',
                        url: 'http://underscorejs.org/',
                        tag: [
                            {
                                custom: false,
                                text: 'Other Bookmarks' 
                            }
                        ]
                    },
                    {
                        date: 1396299213543,
                        id: '20',
                        title: 'GitHub',
                        url: 'https://github.com/',
                        tag: [
                            {
                                custom: false,
                                text: 'Bookmarks Bar' 
                            },
                            {
                                custom: false,
                                text: 'prog'
                            }
                        ]
                    }
                ]);
                expect(result).to.equal(expected);
            });
        });
    });
});

});