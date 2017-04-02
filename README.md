hccdo
=====

hccdo is a web-only version of [vaemendis](https://github.com/vaemendis)' hccd, an [HTML+CSS Card Designer](https://github.com/vaemendis/hccd/) intended to generate playing cards from a spreadsheet of card descriptions and an HTML template.  The original hccd is a java program, but the java bits weren't actually necessary to do what it does so I ([mcdemarco](https://github.com/mcdemarco)) removed them, and added some features:

* Support for Google or other web fonts.
* Flex layout to solve some table margin issues.
* Images.


usage
-----

1. Download this repository.
2. Edit the main example or create three files with the same naming pattern:
   * an html file with a mustache template for your cards
   * a csv file with a header row plus a row for each card (the header names for the columns are used in the template)
   * an optional CSS file -- you can also write styles directly to the html file
3. Open the html file in a browser.
4. Upload the CSV file when asked.  (You only need to do it once.)
4. Print, being sure to turn off any scaling, headers, and footers.


credits
---------

hccdo uses [mustache](https://mustache.github.io) for templating and [Papa Parse](http://papaparse.com) for csv parsing.

The main example makes very simple cards for the game [Pico](https://boardgamegeek.com/boardgame/2051/pico).  The examples directory contains three examples, all intended for a retheme of the game [Sleuth](https://boardgamegeek.com/boardgame/594/sleuth).

Some images in the examples are from [Game-icons.net](http://game-icons.net).

