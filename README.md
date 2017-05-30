CardPen
========

CardPen is a web-only playing card generator intended to generate PNG images at any DPI, or printable HTML pages of playing cards from a spreadsheet of card descriptions, CSS, and a simple Mustache template.  CardPenalso includes support for Google or other web fonts, adjustable card bleed, various page sizes, and any card size.

usage
--------

1. Open CardPen.  (Download this repository or use the online version.)  It will open the basic example (Pico).
2. You can edit the basic example or (under Project) clear it with the New button, or load a different example.
2. When editing, you can write your CSV, CSS, and template from scratch, or, alternately, upload your own CSV, CSS, and/or mustache template file.  (You only need to upload once.  The css is always optional.)
3. The csv file should have a header row plus a row for each card.  The header names for the columns are available in the template.  
3. Click the HTML button to see the HTML output of your CSV/CSS/template combination.
4. Click the Print button to print the HTML, being sure to turn off any scaling, headers, and footers.
4. Click the Images button to generate the PNG images.  A Zip Images button appears above the images in the output frame; when all images have appeared, click it to download a zip file of the images.  You can also right-click and save or open the images individually if you prefer.

For more information, see [the documentation](doc/index.md).

running
----------

Although it is possible to open CardPen in your browser as an html file (`index.html`), it really should be served by a webserver, due to various browser security issues.  There is a public server at [cardpen.mcdemarco.net](http://cardpen.mcdemarco.net)).

To make it easier to work with your own image files, you can run CardPen on your own computer (instead of using the public install at  Check out CardPen locally, and, if you have your own webserver, just stick CardPen under it somewhere; it doesn't need to be at the root.  If you don't already have a webserver, you can use a node webserver included with the package.  To set it up, [install npm](https://www.npmjs.com/get-npm) (the Node.js package manager), then, at the command line in the CardPen directory, run the following two commands:

> `npm install`
> `npm run server`

The second command will return the new URL for your local CardPen (most likely [http://localhost:8080](http://localhost:8080)).

Place any images you need for your cards in the `images/` directory.

caveats
---------

Everything works in Chrome.  The image exporter doesn't work in Safari or iOS, but basic HTML generation should still work.  YMMV with other browsers.


building
-----------

CardPen doesn't have much of a build process; it uses simple npm scripts instead of a build tool.
The build command, `npm run build`, just converts the docs from markdown to html.

credits
---------

CardPen is by [mcdemarco](https://bitbucket.org/mcdemarco).

CardPen was inspired by vaemendis' [hccd](https://github.com/vaemendis/hccd/), a Java-based HTML/CSV/CSS card design program, and [CodePen](https://codepen.io), an online HTML/CSS/JavaScript development environment.

CardPen uses [mustache](https://mustache.github.io) for templating, [Papa Parse](http://papaparse.com) for csv parsing, [dom-to-image](https://github.com/tsayen/dom-to-image/) (with [pr#103 for dpi settings](https://github.com/tsayen/dom-to-image/pull/103), the fix for [issue #95](https://github.com/tsayen/dom-to-image/issues/95), and a workaround for [issue #50](https://github.com/tsayen/dom-to-image/issues/50)) for image generation, [FileSaver](https://github.com/eligrey/FileSaver.js) for saving, [CodeMirror](http://codemirror.net) for editing, and [bind](https://github.com/remy/bind.js) ([commit 0cdcdb36f3](https://github.com/remy/bind.js/tree/0cdcdb36f3207191527c6de5367a518334f08d48) with [pr#16](https://github.com/remy/bind.js/pull/16/files)) and [underscore](http://underscorejs.org) under the hood.

The basic example makes very simple cards for the game [Pico](https://boardgamegeek.com/boardgame/2051/pico).  The examples directory contains a copy of the Pico example, an oval version of the Pico example, three more complicated examples for a retheme of the game [Sleuth](https://boardgamegeek.com/boardgame/594/sleuth), and copies of the [IDKWDYWTP](https://boardgamegeek.com/boardgame/28567/i-dont-know-what-do-you-want-play) examples. (There are also [a couple of examples](https://github.com/vaemendis/hccd/tree/master/examples) included with original [hccd](https://github.com/vaemendis/hccd/) that should work with CardPen, too.)

CardPen uses the [BoardGameGeek API](https://boardgamegeek.com/wiki/page/BGG_XML_API2) to fetch your game collection for generating IDKWDYWTP decks.  Due to an [issue with the API](https://boardgamegeek.com/thread/1304818/cross-origin-resource-sharing-cors), CardPen needs a proxy for CORS like [crossorigin.me](https://github.com/technoboy10/crossorigin.me) in order to fetch your collection; the IDKWDYWTP example is already set up to use such a proxy.

The UI backgrounds are Low Contrast Linen by Jordan Pittman and Fabric (Plaid) by James Basoo from [Subtle](https://www.toptal.com/designers/subtlepatterns/low-contrast-linen/) [Patterns](https://www.toptal.com/designers/subtlepatterns/fabric-plaid/).  The help page CSS was inspired by Firefox's Reader View and [Edward Morbius' website](http://codepen.io/dredmorbius/pen/KpMqqB).  Some images in the examples are from [Game-icons.net](http://game-icons.net).  The card icon is from the [EmojiOne Project](https://github.com/Ranks/emojione/blob/2.2.7/assets/svg/1f0cf.svg), version 2 (CC BY 4.0).


