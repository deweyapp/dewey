define(
[
  'underscore'
],
function(_) { "use strict";

/*
* Bookmarks storage.
*/
var BookmarksStorage = function () {

  var bookmarks = {};
  var customTagsStorage = [];

  /*
  * Save chunk with custom tags by index (key will be t[Index]).
  */
  var saveCustomTagsChunk = function(index, chunk) {
    var change = {};
    var key = 't' + index;
    change[key] = chunk;
    chrome.storage.sync.set(change);
  };

  /*
  * Find chunk which stores custom tags for bookmark and remove this information.
  */
  var removeCustomTags = function(bookmarkUrl) {
    _.each(customTagsStorage, function(chunk, index) {
      if (chunk.d[bookmarkUrl]) {
        delete chunk.d[bookmarkUrl];
        saveCustomTagsChunk(index, chunk);
      }
    });
  };

  /*
  * Save custom tags to chunk.
  */
  var saveCustomTags = function(bookmarkUrl, customTags) {
    // Try to find chunk and index of this chunk
    // which has less than 20 items
    var chunk, index;
    for (var i = 0; i < customTagsStorage.length; i++) {
      if (_.size(customTagsStorage[i].d) < 20) {
        chunk = customTagsStorage[i];
        index = i;
        break;
      }
    }
    // If don't have chunk with less than 20 items
    // Create new one.
    if (!chunk) {
      chunk = { d: {} };
      var lChunk = _.last(customTagsStorage);
      // If previous chunk exist and it does not know about new chunk
      // Update it with setting next = true
      if (lChunk && !lChunk.n) {
        lChunk.n = true;
        saveCustomTagsChunk(customTagsStorage.length - 1, lChunk);
      }
      index = customTagsStorage.length;
      customTagsStorage.push(chunk);
    }
    // Save custom tags for bookmark
    chunk.d[bookmarkUrl] = customTags;
    saveCustomTagsChunk(index, chunk);
  };

  /*
  * Get all chunks with custom tags.
  */
  var enumerateAllCustomTagChunks = function(currentChunk, index, done) {
    if (currentChunk && currentChunk.n) {
      index++;
      var key = 't' + index;
      chrome.storage.sync.get(key, function(data) {
        if (data[key]) {
          customTagsStorage.push(data[key]);
        }
        enumerateAllCustomTagChunks(data[key], index, done);
      });
    } else {
      done();
    }
  };

  /*
  * Add all custom tags from array to bookmark tags.
  */
  var fillBookmarkWithCustomTags = function(bookmark) {
    var chunk = _.find(customTagsStorage, function(chunk) { return _.isArray(chunk.d[bookmark.url]); });
    if (chunk) {
      _.each(chunk.d[bookmark.url], function(tag){
        bookmark.tag.push({text: tag, custom: true});
      });
    }
  };

  /*
  * Recursive bookmarks traversal (we use folders as tags)
  */
  var enumerateChildren = function(tree, tags, level, hideTopLevelFolders) {
    if (tree) {
      _.each(tree, function(c) {
          if (!c.url) {
              var t = tags.slice();
              if (c.title && ((!hideTopLevelFolders) || level > 1)) {
                  t.push(c.title);
              }
              enumerateChildren(c.children, t, level + 1, hideTopLevelFolders);
          } else {
              var bookmark = {
                  title: c.title,
                  url: c.url,
                  tag: [],
                  date: c.dateAdded,
                  id: c.id
              };

              _.each(tags, function(tag) {
                bookmark.tag.push({text: tag, custom: false});
              });

              fillBookmarkWithCustomTags(bookmark);

              bookmarks[bookmark.id] = bookmark;
          }
      });
    }
  };

  /*
  * Add custom tags to bookmarks.
  */
  var fillCustomTags = function(customTags) {
    _.each(bookmarks, function(bookmark) {
      // Remove all custom tags from bookmark first
      bookmark.tag = _.filter(bookmark.tag, function (t) { return t.custom === false; });
      saveCustomTags(bookmark.url, customTags[bookmark.url]);
    });
  };

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      if (changes.hasOwnProperty(key) && key === 'customTags') {
        customTags = changes[key].newValue;
        if (customTags) {
          fillCustomTags(customTags);
        }
      }
    }
  });

  /*
  * Get all bookmarks with all custom tags.
  */
  this.getAll = function(callback) {
    bookmarks = {};
    this.loadSettings(function(settings) {
      // At first get custom tags and after this start bookmarks traversal.
      enumerateAllCustomTagChunks({n: true}, -1, function() {
        chrome.bookmarks.getTree(function(tree) {
          enumerateChildren(tree, [], /* level: */ 0, settings.hideTopLevelFolders);
          // Custom tags is legacy storage
          // TODO: remove after couple releases support of customTgs key.
          chrome.storage.sync.get('customTags', function(data) {
            if (data && data.customTags) {
              for (var key in data.customTags) {
                if (data.customTags.hasOwnProperty(key)) {
                  saveCustomTags(key, data.customTags[key]);
                }
              }
              chrome.storage.sync.remove('customTags');
            }
            callback(_.values(bookmarks), settings);
          });
        });
      });
    });
  };


  this.update = function(bookmark, changes) {
    var update = {};  // Prepare update document

    if (changes.url !== bookmark.url) {  // If url is different add it to update
      update.url = changes.url;
    }

    if (changes.title !== bookmark.title) {  // If title different add it to update
      update.title = changes.title;
    }

    if (_.keys(update).length > 0) {  // If we have something to change (title or url) let's do it
      chrome.bookmarks.update(bookmark.id, update);
      _.extend(bookmark, update);  // Copy all updates to bookmark after updating chrome bookmarks
    }

    removeCustomTags(bookmark.url);
    bookmark.tag = _.filter(bookmark.tag, function(t) { return t.custom === false; });
    if (changes.customTags && changes.customTags.length > 0) {
      saveCustomTags(bookmark.url, changes.customTags);
      fillBookmarkWithCustomTags(bookmark);
    }
  };

  /*
  * Remove bookmark.
  */
  this.remove = function(bookmark) {
    removeCustomTags(bookmark.url);
    chrome.bookmarks.remove(bookmark.id);
  };

  /*
   * Set settings for top level folders
   */
  this.setHideTopLevelFolders = function(value, cb) {
    chrome.storage.sync.set({ 'hide-top-level-folders': value }, cb);
  };

  /*
   * Set show thumbnails
   */
  this.setShowThumbnails = function(value, cb) {
    chrome.storage.sync.set({ 'show-thumbnails': value }, cb);
  };

  /*
   * Get show thumbnails
   */
  this.loadSettings = function(cb) {
    chrome.storage.sync.get(
      [
        'show-thumbnails',
        'hide-top-level-folders'
      ],
      function(flag) {
        cb(
          {
            showThumbnails: flag['show-thumbnails'], // Default value is true.
            hideTopLevelFolders: flag['hide-top-level-folders'] || false // Default value is false.
          }
        );
      }
    );
  };
};

/*
* Bookmarks storage factory method.
*/
var BookmarksStorageFactory = function() {
  return new BookmarksStorage();
};

return [
  BookmarksStorageFactory
];

});