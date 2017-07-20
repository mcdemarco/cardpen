# About CardPen

## What

CardPen generates simple HTML pages of cards for printing up yourself,
or it can convert your HTML cards to PNG images at any DPI
for uploading to card printing services that accept image files.

CardPen includes presets for most common (and many uncommon) card sizes,
as well as custom sizes, circular cards, bleed support, zipping of your generated images, 
overlays, and turning your BoardGameGeek game collection into cards.

## Where

CardPen is available online at [cardpen.mcdemarco.net](http://cardpen.mcdemarco.net/);
you can also download the project [from BitBucket](https://bitbucket.org/mcdemarco/cardpen) and run it locally.

## Why

CardPen assumes that you know your way around HTML but not around inDesign or nanDECK.
Maybe you can't afford Adobe products and don't have a Windows machine handy to run nanDECK on,
or your layout is simple and your project too casual to invest the time in learning a more powerful tool.
But you know HTML already, and maybe even Mustache.

If you've used [hccd](https://github.com/vaemendis/hccd/),
you might find it worth switching to CardPen for extra options like bleed and overlays.

### Why Not

Some printers require inDesign or other professional file formats, and CardPen won't help you there.

Mustache (the templating engine used by CardPen) is not a scripting language
and cannot do some of the [very cool things](https://boardgamegeek.com/blogpost/39003/nandeck-metrotsuro-hex-tile) that other tools do.

If you don't know HTML and CSS already, or don't feel like hacking your way around Mustache,
you may want to spend your time learning more appropriate tools for the job.
Also, if you're not willing to run it in a modern browser, CardPen may not work well for you.

See the end of this file for some alternatives to CardPen.

## How

Your cards are assembled from a card list, a Mustache/Handlebars template, and optional CSS styles.
You edit these and other settings in the upper half of the CardPen window,
while the cards themselves appear in the bottom half of the CardPen window (as does this documentation).
See the How To page for more details.


## Whence

Not all card printing services accept PNG files, but many do.

### Card Printing Services

* [ArtsCow](http://www.artscow.com/) prints a handful of card sizes and shapes.  (Beware their weird minis!)   Not all their offerings let you set up more than one back, and some come with a pre-configured suit that you will probably need to remove from the cards.  On the bright side, they have enticing sale prices and they also print memo pads, which may be useful for scorepads.  ([Rumor has it](https://boardgamegeek.com/thread/1760777/how-make-score-pad) that you can also get scorepads printed at some FedEx Office/Kinkos locations.)
* [The Game Crafter](https://www.thegamecrafter.com)'s card sizes are listed [here](http://help.thegamecrafter.com/article/85-cards); they recently added [Euro Poker](https://www.thegamecrafter.com/publish/product/EuroPokerDeck) size.  They also print everything you might need for an entire board game: score pads, boxes, boards, etc. and sell non-customized bits, too.  (You need to register and create a game to buy most of them.)
* [Make Playing Cards](http://www.makeplayingcards.com/)' card sizes and prices are [here](http://www.makeplayingcards.com/low-price-for-bulk.aspx); they also make custom poker chips.
* [Printer's Studio](http://www.printerstudio.com/)'s card sizes are listed [here](http://www.printerstudio.com/unique-ideas/blank-playing-cards.html).  They also make a large variety of game mats.
* [Superior Pod](http://www.superiorpod.com/) doesn't have a single card size list, but their sizes seem to be poker, bridge, mini, question, 3.5" square and tarot.  Their submission requirements are [somewhat unclear](http://support.superiorpod.com/customer/en/portal/articles/2727142-file-submission-guidelines-for-card-decks) but seem to include a zip file of individual image files.  There's a [long BGG thread](https://boardgamegeek.com/thread/427619/superior-pod-thread/) about them you might want to read before buying.

Although they print the rare Skinny Mini, [DriveThruCards](http://www.drivethrucards.com) doesn't actually seem to accept image files, only PDFs.  For the record, their card sizes and costs are listed [here](https://onebookshelfpublisherservice.zendesk.com/hc/en-us/articles/227867627-Printed-Card-Formats-Costs).

Although they accept image files, [Print & Play](https://www.printplaygames.com/) requires that you format them in large sheets of 18 or so cards for printing.  CardPen will not do that part automatically for you, though you may be able to do it yourself.  For the record, their sizes are listed [here](https://www.printplaygames.com/product/standard_sizes), including unusual square and index card sizes.


### Sleeves

Sleeves are a cheap way to mock up a card game.
Sleeve your printouts in front of actual cards, or use thicker paper or opaque sleeves for the best results.
The bigger sleeve manufacturers support all sorts of weird sizes.

* [Dragon Shield sleeves](http://www.arcanetinmen.dk/products/board-game-sleeves) aren't just for Magic anymore.
* [Fantasy Flight sleeves](https://www.fantasyflightgames.com/en/products/fantasy-flight-supply/) are not the cheapest.
* [KMC sleeves](http://kmcsleeves.com) are still mostly for Magic; beware the minis that aren't really mini!
* [Mayday Games' sleeves](https://www.maydaygames.com/collections/card-sleeves) are not, rumor has it, always of consistent quality.
* [Ultimate Guard sleeves](http://www.ultimateguard.com/en/card-sleeves.html) come in many colors and types.
* [Ultra PRO sleeves](http://www.ultrapro.com/product_list.php?cPath=70) are called *deck protectors*.

## Which

You can't swing a cat without hitting a card-making program.
Here are some alternatives you might want to try instead of CardPen.

### For Windows

* [nanDECK](http://www.nand.it/nandeck/) is the father of them all, but Windows-only.
* [CardMaker](https://github.com/nhmkdev/cardmaker) is Windows-only.
* [Card Game Management System](http://cardbuilder.blob.core.windows.net/cardgamemanagementsystem/publish.htm) is yet another Windows program.

### For Mac

* [MultiDeck](http://multideck.blogspot.com) runs on MacOS only.

### Multiplatform:

* [Squib](http://squib.rocks) is similar in functionality to nanDECK, but Ruby-based.
* [hccd](https://github.com/vaemendis/hccd/) is Java-based.
* [Strange Eons](http://cgjennings.ca/eons/help.html#developers) is also multi-platform.
* [XXPaper](https://github.com/clearclaw/xxpaper) makes bits for 18xx games.

### Online

* [PnPDeliver](http://court-jus.github.io/PnPDeliver/) is "a tool to help game designers distribute their PnP games and to help PnP players to print them."  It relies on online image files, though it will work with locally-hosted image files---you can use the webserver that comes with CardPen for this purpose.
* [Geckos](http://gulix.github.io/geckos/) is a replacement for (not to mention an improvement over) several online Magic-style card making programs that have disappeared over the years.

## Who

CardPen is by M. C. DeMarco ([fiddly_bits](https://www.boardgamegeek.com/user/fiddly_bits) at BGG);
it was inspired by [hccd](https://github.com/vaemendis/hccd/) and [CodePen](https://codepen.io).
The code and more gory details are available at [BitBucket](https://bitbucket.org/mcdemarco/cardpen/).

CardPen is licensed under the GNU General Public License v3.0.

### When

This is CardPen version 1.0.1, &copy; 2017.
