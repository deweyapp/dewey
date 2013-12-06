# Bookmarks

Bookmarks is a [Chrome Browser application](https://chrome.google.com/webstore/detail/bookmarks/aahpfefkmihhdabllidnlipghcjgpkdm), which gives you an easy way to manage bookmarks and navigate through them. 

After you start this application you can:

- Do search on your bookmarks. You can search by all fields (title, tag, url) or specify one or more operators, like 'tag:dev', which filters bookmarks by tag 'dev'.
- One of the bookmarks is highlighted, this is selected bookmark. On Enter application navigates you to selected bookmark.
- You can use Arrow Up/Down keyboard keys to navigate through bookmarks list.
- Application uses folder names as a standard tags, but it also gives you an option to add custom tags. 

## Installation

To install Bookmarks application just follow the link to [Chrome Web Store](https://chrome.google.com/webstore/detail/bookmarks/aahpfefkmihhdabllidnlipghcjgpkdm) using Chrome Browser.

## Author
**Denis Gladkikh**

- [http://outcoldman.com](http://outcoldman.com)
- [https://twitter.com/outcoldman](https://twitter.com/outcoldman)
- [https://github.com/outcoldman](https://github.com/outcoldman)

## License
  Apache License, Version 2.0

## Contributing
- Issues / suggestions: https://github.com/outcoldman/chrome-bookmarks/issues

## Donate
If you liked this extension and you are looking for a way to support future development (or just say thank you), you always can do it with PayPal donate button below

[![PayPal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif "PayPal Donation")](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=outcoldman%40gmail%2ecom&lc=US&item_name=Donation%20for%20supporting%20bookmarks%20application&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted)

## Changelog
- 1.1.2 (October 30 2013) - Use bookmarks url as identity instead of id (each chrome installation has it is own identities). Chrome storage has limitation on item size, changed the way I store custom tags in storage, split it by chunks.
- 1.1.1 (October 29 2013) - Fix issue #1.
- 1.1 (October 28 2013) - Updated bookmark edit dialog with options to edit title, custom tags and delete bookmark.
- 1.0 (October 13 2013) - Ready for use first version of application in Chrome Web Store.
- 0.1 (September 27 2013) - First prototype on [Seattle Google Developer Groups Dev Fest 2013](http://www.meetup.com/seattle-gdg/events/125948972/). 

<a href="http://www.flickr.com/photos/pahphotos/10015447933/" title="The winner took home a chromebook. by Seattle.roamer, on Flickr"><img src="http://farm8.staticflickr.com/7320/10015447933_f59bee5f0b.jpg" width="331" height="500" alt="The winner took home a chromebook."></a>

##Icons
All icons used in this application are released to the public with No Copyright (CC0 1.0 Universal (CC0 1.0) Public Domain Dedication), *except* for the 'bookmarks' icon which is a part of [Icomoon](http://icomoon.io).

## Using resources
To build this application I used following Open Source libraries and resources:

- [bootstrap](http://getbootstrap.com/)
- [jQuery](https://jquery.org)
- [AngularJS](http://angularjs.org/)
- [IcoMoon.io](http://icomoon.io/) - `bookmarks` icon is used as an application icon.
- [UnderscoreJS](http://underscorejs.org/)
- [RequireJS](http://requirejs.org/)
- [UI Bootstrap](http://angular-ui.github.io/bootstrap/) - custom build with patch for Modal dialog (from branch _bootstrap3_bis2_modalPatch_)
- [bootstrap-tagsinput](http://timschlechter.github.io/bootstrap-tagsinput/examples/bootstrap3/) - with small modification of `bootstrap-tagsinput-angular`

