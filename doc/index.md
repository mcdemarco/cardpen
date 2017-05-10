# Help using HCCDo

## What

HCCDo (*HTML+CSS Card Designer online*) generates simple HTML pages of cards for printing them up yourself,
or it can convert your cards to PNG images at any DPI for uploading to card printing services that accept PNGs.

HCCDo includes presets for most common (and many uncommon) card sizes, custom sizes, circular cards,
bleed, and zipping of your generated images.

## Where

The *o* is for online; HCCDo is available online at [hccdo.mcdemarco.net](http://hccdo.mcdemarco.net/).
You can also download the project from github and run it locally.

## Why

HCCDo assumes that you know your way around HTML but not around inDesign or nanDECK.
Maybe you can't afford Adobe products and don't have a Windows machine handy to run nanDECK on,
or your layout is simple and your project too casual to invest the time in learning a more powerful tool.
But you know HTML already, and maybe even Mustache.

If you've used [hccd](https://github.com/vaemendis/hccd/) before,
you might find it worth switching to HCCDo for new options like bleed.

### Why Not

Note that some printers require inDesign or other professional file formats, and HCCDo won't help you there.

Mustache (the templating engine) is not a scripting language
and cannot do some of the [very cool things](https://boardgamegeek.com/blogpost/39003/nandeck-metrotsuro-hex-tile) that other tools do.

If you don't know HTML and CSS already, or don't feel like hacking your way around Mustache,
you may want to spend your time learning more appropriate tools for the job.

Also, if you're not willing to run it in a modern browser, HCCDo may not work well for you.

#### Alternatives

If you're tempted by [nanDECK](http://www.nand.it/nandeck/), there are some similar options out there that aren't all Windows-only:
[Squib](http://squib.rocks) is Ruby-based, [MultiDeck](http://multideck.blogspot.com) runs on MacOS, [Strange Eons](http://cgjennings.ca/eons/help.html#developers) is multi-platform, [CardMaker](https://github.com/nhmkdev/cardmaker) and [Card Game Management System](http://cardbuilder.blob.core.windows.net/cardgamemanagementsystem/publish.htm) are more Windows programs, and [XXPaper](https://github.com/clearclaw/xxpaper) makes bits for 18xx games.

## How

To see your current cards (or the example set of Pico cards), click *Generate HTML*.
To see this help page again, click *Help*.

Your cards are assembled from a card list, a Mustache template, and (optionally) additional CSS styles.
You can upload these, cut and paste them in, or type them in.
The text boxes are expandable (in modern browsers); if you want to see more, just drag on the lower right corner.

You can also load an existing project file; there are several of these in the `examples/` directory.

### The Card List

You can upload a CSV file containing all the information about your cards, or you can enter the data manually.  In either case, the CSV delimiter (usually a comma, semicolon, or tab) will be detected automatically.

The first line of your card list should be a header with short names for each of your columns.
Each remaining line should have the same number of columns (you can leave some blank), and should describe one card from your set.

The **+** button will add a duplicate card to the end of your list.  The **-** button will remove your last card.

There is a special field, *card classes* for turning a column (or multiple columns) into CSS classes on each card, which is especially useful for adding background images when doing card bleeds.  (Because the card wrapper itself does not appear in your Mustache template, you can't put a CSS class on it directly.)

To use the *card classes* field, put the exact name(s) of your csv column(s) into the field.  Be sure that the *contents* of each column you're using this way are all valid CSS class names---*e.g.*, single words, not starting with a number, and without any special characters beyond a hyphen or underscore.  For more than one class/column, separate them with spaces.

You can also use the built-in card classes: *card* and *cardN*, where *N* is the row number of the card.

### The Template

You can upload a Mustache template or enter it manually.

The template is mostly plain HTML laying out a single card from your set.
To insert card-specific information, use Mustache braces around one of your column titles from your card list:  `{{YourColumnNameHere}}`.

In the Pico example, there are only two columns in the CSV file, named *Number* and *Score*.  The card's number is inserted in five places on the card: the center and the four corners.  The card's score is used as part of a CSS class that inserts the scoring pips.

There is a special Mustache tag that you can use to change your template based on whether you are generating cards as HTML or as images: `{{cardImage}}`.  To turn a section of the template on when you are generating card images, put it between two tags `{{#cardImage}}` and `{{/cardImage}}`.  To turn a section off, put it between `{{^cardImage}}` and `{{/cardImage}}`.  For an example of this, click the IDKWDYWTP button and scroll down to the bottom of that template.  (The code is adding a proxy to the BoardGameGeek image URL when generating images because BGG is not set up correctly for CORS.  You can also use these tags to compensate for unwanted differences between your HTML and image output.)

For more hints on how to set up your Mustache template, see the additional examples, [the examples from hccd](https://github.com/vaemendis/hccd/tree/master/examples), and/or [the Mustache documentation](https://mustache.github.io/mustache.5.html).

### The Styles

You can upload a CSS file, enter CSS styles manually, or skip this section of the form altogether; it's possible to put your styles inline on elements in your template instead (though not within `<style>` tags).

The examples use flexbox and some CSS transforms to position the card elements, but you can use tables or any other approach you like.

When styling your cards, you should use print units like *in*, *mm*, or *pt* (points) in order to keep your output true to the chosen card size.

#### Fonts

You can add Google Fonts or other fonts (*e.g.*, [FontAwesome](https://www.bootstrapcdn.com/fontawesome/)) using the *External Stylesheet* setting.  [FontCDN](http://fontcdn.org) is a handy way to search for Google Fonts.  The Pico example also uses a [Google font effect](https://developers.google.com/fonts/docs/getting_started#enabling_font_effects_beta) for the text shadow.  (If you don't see it, you may not be using a browser that supports their font effects.)

The Pico example uses two Google Fonts; see the CSS for how they are invoked.

### Art

You can include URLs for background images in your CSS, and trigger different ones using classes in your template.  (This is done in all the Scottish Sleuth examples.)

For foreground images, you can include the URLs as part of the card list and put the url into an *img* tag in your template.  (See the IDKWDYWTP example for a foreground image.)  If your foreground image never changes, you can put it into your template directly instead.

HCCDo needs to be able to find your images "online".  You can use public URLs of images that are already available online
or that you've uploaded to an image hosting site like [Google Photos](https://www.google.com/photos/about/) or [Unsee](https://unsee.cc), but note that some public images may not work with HCCDo due to CORS issues.  Click the `IDKWDYWTP` button for an example of using a CORS proxy to work around CORS issues.

If you have many images or if you're having CORS issues, you may want to run HCCDo locally.
If you put your images in the images directory, you can refer to them as the examples do.
(See `IDKWDYWTPLocalImages.json` for an example.)

### More Settings

The most important setting is card size, which defaults to *poker (2.5"x3.5")*.
You can change the orientation of your cards to *landscape*; the default is *portrait*.
You can also set the spacing (gutter) between the cards.

You don't have to keep all the units (millimeters or inches) in sync, but your results may be more accurate if you do.

#### Bleed

You can add a bleed outside the card proper (this increases the size of your cards by the specified amount), and you can also designate a safe region inside the card proper.  Most printing services require 1/8" bleed per side and recommend a 1/8" safe zone (sometimes expressed as 36 pixels at 300 DPI rather than as 0.125" or  0.12").

#### Borders

The border option is to provide a cut line when printing cards yourself.  Making actual thick borders around a card is not generally recommended and so is not automated by HCCDo, though you can still make such a thing.

When making your own borders around cards, The Game Crafter recommends that the border extend about 1/8" into the safe zone.

#### Corners

You can set the corner radius in HCCDo, though leaving it off or getting them wrong will probably not matter much in the print process.  In the wild, card corner diameters vary between 1/8" and 1/4"; The Game Crafter claims that "US Game" size tends to larger corner radius while smaller is standard.

Read more about corners at [Dreadful Games](http://dreadfulgames.com/rounders-your-guide-to-rounded-corner-cards-for-your-board-game/).

### Saving

HCCDo always stores your current card setup in local storage, so you can come back to it in the same browser later on (but not forever, and not if you overwrite it with another set of cards).

For longer-term storage, use the Export button to save your card project in a json file.  You can load the saved file under *Load project file*.  You can also load the extra examples in the examples directory this way.

### Generating Cards

You have two options when generating cards:  creating a printable HTML page (for DIY cards), or generating a zip file of individual card PNG images (for uploading to a commercial card printer's site).

#### Printing HTML

Before generating HTML to print, choose the appropriate page size for your paper.  Your cards may fit better in one direction than the other, so try switching from landscape to portrait or back before printing.

The *Print* button prints the cards; in some browsers you can also right-click on the frame and choose Print Frame from the context menu.

When printing HTML, be sure to uncheck or undo any scaling as well as removing any headers/footers that the browser might add.
Some browsers will not detect your choice of landscape or portrait for your page layout,
so you may need to set that manually in the print dialog before printing.

### Generating Images

Not all browsers can generate images; Safari will not, nor will any iOS browser.  Any other version of Chrome will.

When generating images, choose an adequate DPI (300 is most printers' minimum), then click *Generate Images*.  The images will appear in this section of the page, with a *Zip Images* button above them.  Some browsers will display them very small; right-click on an image to open it in a new tab (then, additionally, zoom in if your browser is zoomed out) to see the image at its real pixel size.

Image generation is a dark art that sometimes goes wrong; if something looks awry, try again.

To download the images, click the *Zip Images*  button.
The images in the zip file will be named after your project and numbered sequentially.


## Which

The *View* button will show you all the built-in card sizes, using your current settings for bleed and orientation.

### Card Size Clarification

* When in doubt, the size is poker.
* Sometimes poker size is described as "Standard Game" or "Standard Card Game", and bridge size as "Standard American" or "American Board Game" for the purposes of sleeving, but these are not to be confused with the actual panoply of weird "game" sizes.
* Magic the Gathering cards are poker size.
* Euro Mini (44mm x 67mm) is sometimes listed in US sizes as 1.73" x 2.64".
* Skinny Mini is the Fantasy Flight/DriveThruCards size of 1 5/8" x 2 1/2", also known as Mini American; more commonly Mini means 1 3/4" x 2 1/2" instead.  (Bicycle claims "mini" is actually 1 11/16" x 2 3/8", but no one prints that size.)
* Cow Mini is ArtsCow's weird mini size (h/t [this BGG thread](https://boardgamegeek.com/thread/759945/artscow-mini-playing-cards-size-vs-ideal-image-siz) about some old typos at ArtsCow).
* Game is the size of, *e.g.*, Fluxx cards, and is sometimes listed in US sizes as 2.20472" x 3.4252".
* Square (2.75") is sometimes listed as 2 11/16" or 70mm for the purposes of sleeving.
* Small Memo is a larger square (3.75").
* Business is sometimes called Biz or Question.

Some sizes are listed because sleeves for them are common, while no one prints them---most notably, euroGame and euroMiniGame.

## Whence

Not all card printing services accept PNG files, but many do.

### Card Printing Services

* [ArtsCow](http://www.artscow.com/) prints a handful of card sizes and shapes.  (Beware their weird minis!) They also print memo pads, which may be useful for scorepads.  [Rumor has it](https://boardgamegeek.com/thread/1760777/how-make-score-pad) that you can also get scorepads printed at some FedEx Office (Kinkos) locations.
* [The Game Crafter](https://www.thegamecrafter.com)'s card sizes are listed [here](http://help.thegamecrafter.com/article/85-cards)
* [Make Playing Cards](http://www.makeplayingcards.com/)' card sizes and prices are [here](http://www.makeplayingcards.com/low-price-for-bulk.aspx); they also make custom poker chips.
* [Printer's Studio](http://www.printerstudio.com/)'s card sizes are listed [here](http://www.printerstudio.com/unique-ideas/blank-playing-cards.html).  They also make a large variety of game mats.
* [Superior Pod](http://www.superiorpod.com/) doesn't have a single list, but their sizes seem to be poker, bridge, mini, question, 3.5" square and tarot.  Their submission requirements are [somewhat unclear](http://support.superiorpod.com/customer/en/portal/articles/2727142-file-submission-guidelines-for-card-decks) but seem to include a zip file of individual image files.  There's a [long BGG thread](https://boardgamegeek.com/thread/427619/superior-pod-thread/) about them you might want to read first.

Although they print the rare Skinny Mini, [DriveThruCards](http://www.drivethrucards.com) doesn't actually seem to accept image files, only PDFs.  For the record, their card sizes and costs are listed [here](https://onebookshelfpublisherservice.zendesk.com/hc/en-us/articles/227867627-Printed-Card-Formats-Costs).

Although they accept image files, [Print & Play](https://www.printplaygames.com/) requires that you format them in large sheets of 18 or so cards for printing.  HCCDo will not do that part automatically for you, though you may be able to do it yourself.  For the record, their sizes are listed [here](https://www.printplaygames.com/product/standard_sizes), including unusual square and index card sizes.


### Sleeves

Sleeves are a cheap way to mock up a card game.
Sleeve your printouts in front of actual cards, or use thicker paper or opaque sleeves for the best results.
The bigger sleeve manufacturers support all sorts of weird sizes.

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
