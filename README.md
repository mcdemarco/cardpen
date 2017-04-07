hccdo
========

hccdo is a web-only version of [vaemendis](https://github.com/vaemendis)' hccd, an [HTML+CSS Card Designer](https://github.com/vaemendis/hccd/) intended to generate printable HTML pages of playing cards from a spreadsheet of card descriptions and a simple Mustache template.  The original hccd is a java program, but the java bits weren't actually necessary to do what it does so I ([mcdemarco](https://github.com/mcdemarco)) removed them, and added some features:

* Support for Google or other web fonts.
* Flex layout to solve some table margin issues.
* Export cards as separate images at any dpi.

usage
--------

1. Open hccdo.  (Download this repository or use the online version.)
2. Edit the example or upload your own mustache template, csv file, and/or css file.  (You only need to upload once.  The css is optional and can be deleted.)
3. The csv file should have a header row plus a row for each card.  The header names for the columns are used in the template.  
3. Click the Generate HTML button for HTML.  Print the frame, being sure to turn off any scaling, headers, and footers.
4. Click the Generate Images button for images.  A Zip Images appears above the images (and the original HTML in the frame); when all images have appeared, click it to download a zip file of the images.  You can also right-click and save the images individually from the frame if you prefer.

caveats
---------

Everything works in Chrome.  The image exporter doesn't work in Safari or iOS, but basic HTML generation should still work.  YMMV with Internet Explorer and/or older browsers.

credits
---------

hccdo uses [mustache](https://mustache.github.io) for templating, [Papa Parse](http://papaparse.com) for csv parsing, [dom-to-image](https://github.com/tsayen/dom-to-image/) (with [pr#103 for dpi settings](https://github.com/tsayen/dom-to-image/pull/103) for image generation, and [FileSaver](https://github.com/eligrey/FileSaver.js) for saving.

The basic example makes very simple cards for the game [Pico](https://boardgamegeek.com/boardgame/2051/pico).  The examples directory contains three more complicated examples, all for retheme of the game [Sleuth](https://boardgamegeek.com/boardgame/594/sleuth).  (There are also some examples included in the original [hccd](https://github.com/vaemendis/hccd/), if you want to see more.)

Some images in the examples are from [Game-icons.net](http://game-icons.net).  The UI background is EP Natural Black from [Subtle Patterns](https://www.toptal.com/designers/subtlepatterns/ep-natural-black/).

