# Help using HCCDo

## What

HCCDo (*HTML+CSS Card Designer online*) generates simple HTML pages of cards for printing them up yourself,
or it can convert your cards to images at any DPI for uploading to card printing services that accept PNGs.

HCCDo includes presets for most common (and many uncommon) card sizes, custom sizes, circular cards,
bleed, and zipping of your generated images.

## Where

The *o* is for online; HCCDo is available online at [hccdo.mcdemarco.net](http://hccdo.mcdemarco.net/).
You can also download the project from github and run it locally,
though you may need to serve it from a local webserver for browser security reasons.

## Why

HCCDo assumes that you know your way around HTML but not around inDesign or [nanDECK](http://www.nand.it/nandeck/).
Maybe you can't afford Adobe products and don't have a Windows machine handy to run nanDECK on,
or your layout is simple and your project too casual to invest the time in learning a more powerful tool.
But you know HTML already, and maybe even Mustache.

### Why Not

Note that some printers require inDesign or other professional file formats, and HCCDo won't help you there.
Mustache (the templating engine) is not a scripting language
and cannot do some [very cool things](https://boardgamegeek.com/blogpost/39003/nandeck-metrotsuro-hex-tile) that other tools can.

If you don't know HTML and CSS already, or don't feel like hacking your way around Mustache,
you may want to spend your time learning more appropriate tools for the job.

Also, if you're not willing to run it in a modern browser, HCCDo may not work well for you.

## How

To see your current cards (or the example set of Pico cards), click *Generate HTML*.
To see this help page again, click *Help*.

Your cards are assembled from a card list, a Mustache template, and (optionally) additional CSS styles.
You can upload these, cut and paste them in, or type them in.
The text boxes are expandable (in modern browsers); if you want to see more, just drag on the lower right corner.

### The Card List

You can upload a CSV file containing all the information about your cards, or enter the data manually.

The first line of your card list should be a header with short names for each of your columns.
Each remaining line should have the same number of columns (you can leave some blank), and should describe one card from your set.

### The Template

You can upload a Mustache template or enter it manually.

The template is mostly plain HTML laying out a single card from your set.
To insert card-specific information, use Mustache braces around one of your column titles from your card list.

In the Pico example, there is only one column, named *Number*, and the card's number is inserted in three places on the card: the center and the two corners.
For more hints on how to set up your Mustache template, see the additional examples, [the examples from hccd](https://github.com/vaemendis/hccd/tree/master/examples), and/or .

### The Styles

You can upload a CSS file or enter CSS styles manually.

The example uses flexbox styles to position the card elements, but you can use tables or any other approach you like.
You can put all styling information inline in the template, or set classes on your template and define them here.

You should use print units like *in*, *mm*, or *pt* (points) in order to keep your output true to the chosen card size.

#### Fonts

You can add Google Fonts or other fonts (*e.g.*, [FontAwesome](https://www.bootstrapcdn.com/fontawesome/)) using the *External Stylesheet* setting.  [FontCDN](http://fontcdn.org) is a handy way to search for Google Fonts.  The Pico example also uses a [Google font effect](https://developers.google.com/fonts/docs/getting_started#enabling_font_effects_beta) for the text shadow.  (If you don't see it, you may not be using a browser that supports their font effects.)

### Art

You can include URLs for background images in your CSS, and trigger different ones using classes in your template.
For foreground images, you can include the URLs as part of the card list and put the url into an *img* tag in your template.

HCCDo needs to be able to find your images "online".
For a small number of images that aren't already available online,
you can use a image hosting site like [Google Photos](https://www.google.com/photos/about/) or [Unsee](https://unsee.cc).
For more images you may want to run HCCDo locally and put your images in the images directory.

### More Settings

The most important setting is card size, which defaults to *poker (2.5"x3.5")*.
You can change the orientation of your cards to *landscape*; the default is *portrait*.
You can also set the spacing (gutter) between the cards, and add a bleed region around the card (required by card printing services).

You don't have to keep all the units (millimeters or inches) in sync, but your results may be more accurate if you do.

### Printing or Saving

HCCDo stores your current card setup in local storage, so you can come back to it in the same browser later on (but not forever).

#### Printing HTML

Before printing, choose the page size for your paper.  Your cards may fit better in one direction than the other, so try switching from landscape to portrait or back before printing.

The *Print* button prints the cards; in some browsers you can also right-click on the frame and choose Print Frame from the context menu.

When printing HTML, be sure to uncheck or undo any scaling as well as removing any headers/footers that the browser might add.
Some browsers will not detect your choice of landscape or portrait for your page layout,
so you may need to set that manually in the print dialog before printing.

### Generating Images

Not all browsers can generate images; Safari will not, nor will any iOS browser.  Any other version of Chrome will.

When generating images, choose an adequate DPI (300 is most printers' minimum), then click *Generate Images*.  The images will appear in this section of the page, with a *Zip Images* button above them.  To download them, click the button.


## Which

### Card Size Clarification

* When in doubt, the size is poker.
* Sometimes poker size is described as "Standard Game" or "Standard Card Game", and bridge size as "Standard American" or "American Board Game" for the purposes of sleeving, but these are not to be confused with the actual panoply of weird "game" sizes.
* Magic the Gathering cards are poker size.
* Euro Mini (44mm x 67mm) is sometimes listed in US sizes as 1.73" x 2.64".
* Skinny Mini is the Fantasy Flight/DriveThruCards size of 1 5/8" x 2 1/2", also known as Mini American; more commonly Mini means 1 3/4" x 2 1/2" instead.  (Bicycle claims "mini" is actually 1 11/16" x 2 3/8", but no one prints that size.)
* Game is the size of, *e.g.*, Fluxx cards, and is sometimes listed in US sizes as 2.20472" x 3.4252".
* Square (2.75") is sometimes listed as 2 11/16" or 70mm for the purposes of sleeving.
* Small Memo is a larger square (3.75").
* Business is sometimes called Biz or Question.

Some sizes are listed because sleeves for them are common, while no one prints them--most notably, euroGame and euroMiniGame.

## Whence

### Card Printing Services

* [ArtsCow](http://www.artscow.com/) prints basic card sizes, plus memo pads (for scorepads).  [Rumor has it](https://boardgamegeek.com/thread/1760777/how-make-score-pad) that you can also get scorepads printed at some FedEx Office (Kinkos) locations.
* [DriveThruCards](http://www.drivethrucards.com)' card sizes and costs are listed [here](https://onebookshelfpublisherservice.zendesk.com/hc/en-us/articles/227867627-Printed-Card-Formats-Costs).  Beware of their skinny minis!
* [The Game Crafter](https://www.thegamecrafter.com)'s card sizes are listed [here](http://help.thegamecrafter.com/article/85-cards)
* [Make Playing Cards](http://www.makeplayingcards.com/)' card sizes and prices are [here](http://www.makeplayingcards.com/low-price-for-bulk.aspx); they also make custom poker chips.
* [Print & Play](https://www.printplaygames.com/)'s sizes are listed [here](https://www.printplaygames.com/product/standard_sizes), including unusual square and index card sizes.
* [Printer's Studio](http://www.printerstudio.com/)'s card sizes are listed [here](http://www.printerstudio.com/unique-ideas/blank-playing-cards.html).  They also make a large variety of game mats.
* [Superior Pod](http://www.superiorpod.com/) doesn't have a single list, but their sizes seem to be poker, bridge, mini, question, 3.5" square and tarot.  There's a [long BGG thread](https://boardgamegeek.com/thread/427619/superior-pod-thread/) about them.

### Sleeves

Sleeves are a cheap way to mock up a card game.
Sleeve your printouts in front of actual cards, or use thicker paper or opaque sleeves for the best results.
, and the bigger sleeve manufacturers support all sorts of weird sizes

* [Dragon Shield sleeves](http://www.arcanetinmen.dk/products/board-game-sleeves) aren't just for Magic anymore.
* [Fantasy Flight sleeves](https://www.fantasyflightgames.com/en/products/fantasy-flight-supply/) are not the cheapest.
* [KMC sleeves](http://kmcsleeves.com) are still mostly for Magic; beware the minis that aren't really mini!
* [Mayday Games' sleeves](https://www.maydaygames.com/collections/card-sleeves) are not, rumor has it, always of consistent quality.
* [Ultimate Guard sleeves](http://www.ultimateguard.com/en/card-sleeves.html)
* [Ultra PRO sleeves](http://www.ultrapro.com/product_list.php?cPath=70) are called *deck protectors*.

## Who

HCCDo is by M. C. DeMarco ([fiddly_bits](https://www.boardgamegeek.com/user/fiddly_bits) at BGG);
it was inspired by [hccd](https://github.com/vaemendis/hccd/).
The code and more details are available at [bitbucket](https://bitbucket.org/mcdemarco/hccdo/overview).

HCCDo is licensed under the GNU General Public License v3.0.

## When

&copy;2017
