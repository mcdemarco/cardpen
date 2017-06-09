# Help using CardPen

## What

CardPen generates simple HTML pages of cards for printing up yourself,
or it can convert your HTML cards to PNG images at any DPI
for uploading to card printing services that accept image files.

CardPen includes presets for most common (and many uncommon) card sizes,
as well as custom sizes, circular cards, bleed support, zipping of your generated images,
and turning your BoardGameGeek game collection into cards.

## Where

CardPen is available online at [cardpen.mcdemarco.net](http://cardpen.mcdemarco.net/);
you can also download the project [from BitBucket](https://bitbucket.org/mcdemarco/cardpen) and run it locally.

## Why

CardPen assumes that you know your way around HTML but not around inDesign or nanDECK.
Maybe you can't afford Adobe products and don't have a Windows machine handy to run nanDECK on,
or your layout is simple and your project too casual to invest the time in learning a more powerful tool.
But you know HTML already, and maybe even Mustache.

If you've used [hccd](https://github.com/vaemendis/hccd/),
you might find it worth switching to CardPen for extra options like bleed.

### Why Not

Note that some printers require inDesign or other professional file formats, and CardPen won't help you there.

Mustache (the templating engine used by CardPen) is not a scripting language
and cannot do some of the [very cool things](https://boardgamegeek.com/blogpost/39003/nandeck-metrotsuro-hex-tile) that other tools do.

If you don't know HTML and CSS already, or don't feel like hacking your way around Mustache,
you may want to spend your time learning more appropriate tools for the job.
Also, if you're not willing to run it in a modern browser, CardPen may not work well for you.

See the end of this file for some alternatives to CardPen.

## How

Your cards are assembled from a card list, a Mustache/Handlebars template, and optional CSS styles.
You edit these and other settings in the upper half of the CardPen window,
while the cards themselves appear in the bottom half of the CardPen window (as does this help file).

### Projects

Sets of cards are organized into projects.
To change your current project, click one of the buttons under Project (at the top of the CardPen window):

* **New** resets the editor to an empty project with some popular defaults.
* **Saved** loads the last project you edited.
* **Example** loads the Pico example.
* **BGG** loads the BoardGameGeek API example (a deck of *I Don't Know, What Do You Want to Play?* cards).
* **Load** opens an input for loading an existing project file.

By default, CardPen will load your last project, or if you haven't used it before, the Pico example.
In the `examples/` directory, there are several more sample project files you can load. 

### Views

Switching between views in CardPen changes the layout of the editor (not of your cards).

Individual editors for your CSV, CSS, and template are available in the **Editor** view.  The editors plus all other options are shown in the **Advanced** view.  The **Cards Only** view maximizes the section of the window devoted to your cards.  This documentation is visible in the **Help** view.

#### Editor View

The Editor view is the default view.

##### Your Card List

You can upload a CSV (comma-separated value) file containing all the information about your cards, or you can enter the data manually.  In either case, the CSV delimiter (usually a comma, semicolon, or tab) will be detected automatically.

The first line of your card list should be a header with short names for each of your columns.
Each remaining line should have the same number of columns and should describe one card from your set.  You can leave some fields blank, but you should include the delimiter.  (Load the Scottish Sleuth Clue Deck example to see a card list with blank fields.)

The **+** button will add a duplicate card to the end of your list.  The **-** button will remove the last card from your list.

###### Card Classes

The **Card classes** setting turns one or more columns from your card list into CSS classes on each card, which is especially useful for adding background images when doing card bleeds.  (Because the card wrapper element itself, `card`, does not appear in your Mustache template, you can't put a CSS class on it directly.)

To use the **Card classes** setting, switch to the Advanced view and put the exact name(s) of your card list column(s) into the field.  Be sure that the *contents* of each column you're using this way are valid CSS class names---*e.g.*, single words, not starting with a number, and without any special characters beyond a hyphen or underscore.  (They can also be blank for some cards.)  To add more than one class/column to **Card classes*, separate them with spaces.

There is also a built-in card class, *cardN*, for the nth card of your current list.

###### Rowsets

The **Rowsets** setting lets you use more than one row from your card list make a single card.  To use the **Rowsets** setting, switch to the Advanced view and put the number of rows you want to group together into the field.  Then choose whether you want rows to be picked from your list at random (without reuse), in order (in bunches), or equidistantly (cycling through the whole list).

To iterate over the rows individually in your template, use the `{{#rowset}}` and  `{{/rowset}}` tags.  In addition to the normal columns, the particular `{{@index}}` of your row within the rowset is also available.
(See the Xendo and RGB examples for more details.)

##### Your Template

You can upload a Mustache or Handlebars template, or enter one manually.

The template is mostly plain HTML laying out a single card from your set.
To insert card-specific information, use Mustache-style braces around one of your column titles from your card list:  `{{YourColumnNameHere}}`.

In the Pico example, there are only two columns in the CSV file, named *Number* and *Score*.  The card's number is inserted in five places on the card: the center and the four corners.  The card's score is used as part of a CSS class that inserts the scoring pips.

There is a built-in tag that you can use to change your template based on whether you are generating cards as HTML or as images: `{{cardImage}}`.  To turn a section of the template on when you are generating card images, put it between two tags `{{#cardImage}}` and `{{/cardImage}}`.  To turn a section off, put it between `{{^cardImage}}` and `{{/cardImage}}`.

For an example of using this tag, click the **BGG** button and scroll down to the bottom of that template.  The template uses the tag to add a proxy to the BoardGameGeek image URL when generating images (because BGG is not set up correctly for CORS).  You can also use these tags to compensate for unexpected differences between your HTML and image output.

For more hints on how to set up your Mustache/Handlebars template, see the additional examples, [the examples from hccd](https://github.com/vaemendis/hccd/tree/master/examples), the [Mustache documentation](https://mustache.github.io/mustache.5.html), or the [Handlebars docs](http://handlebarsjs.com).

##### Your Styles

You can upload a CSS file, enter CSS styles manually, or skip this section of the editor altogether.  It is possible to put all your styles inline on elements in your template instead of in this section (though not within `<style>` tags).

The examples use flexbox and some CSS transforms to position various card elements, but you can use tables or any other approach you like.  When styling your cards, you should use print units like *in*, *mm*, or *pt* (points) in order to keep your output true to the chosen card size.

When writing your CSS, keep in mind that you can add your own card classes (as explained previously), use the built-in card class *cardN* of each card, and even (carefully) style the parent `card` element.

#### Advanced View

Click the **Advanced** button to view and change your project settings.

##### Card Size

The most important setting is card size, which defaults to *poker (2.5"x3.5")*.
You can change the orientation of your cards to *landscape*; the default is *portrait*.
You can also set the spacing (gutter) between the cards.

You don't have to keep all the units (millimeters or inches) in sync, but it certainly won't hurt.

##### Bleed

You can add a bleed outside the card proper (which increases the size of your cards by the specified amount), and you can also designate a safe region inside the card proper.  Most printing services require 1/8" bleed per side and recommend a 1/8" safe zone (sometimes expressed as 36 pixels at 300 DPI rather than as 0.125" or  0.12").

To visualize your bleed and safe areas, check the **overlay** checkbox.  The overlay only appears in the HTML view; it will not print out or be included in your card images.

##### Fonts

You can add Google Fonts or other fonts (*e.g.*, [FontAwesome](https://www.bootstrapcdn.com/fontawesome/)) using the **External Stylesheet** setting.  [FontCDN](http://fontcdn.org) is a handy way to search for Google Fonts.  The Pico example also uses a [Google font effect](https://developers.google.com/fonts/docs/getting_started#enabling_font_effects_beta) for the text shadow.  (If you don't see it, you may not be using a browser that supports their font effects.)

The Pico example uses two Google Fonts; see the CSS for how they are invoked.

Please note that Google fonts may scale incorrectly when converted to images at higher DPI.  If you experience this problem, you can install the fonts on your computer instead.  (Most Google fonts are also available free elsewhere online in system font format.)

##### Corners

You can set the corner radius in CardPen, though leaving it off or getting them wrong will probably not matter much in the print process.  In the wild, card corner diameters vary between 1/8" and 1/4"; The Game Crafter claims that "US Game" size tends to larger corner radius while smaller is standard.

Read more about corners at [Dreadful Games](http://dreadfulgames.com/rounders-your-guide-to-rounded-corner-cards-for-your-board-game/).

#### Art

You can include URLs for background images in your CSS, and trigger different ones using classes in your template.  (This is done in all the Scottish Sleuth card examples.)

For foreground images, you can include the URLs as part of the card list and put the url into an *img* tag in your template.  (See the BGG example for a foreground image.)  If your foreground image never changes, you can put it into your template directly instead.

CardPen needs to be able to find your images "online".
You can use public URLs of images that are already available online
or that you've uploaded to an image hosting site like [Google Photos](https://www.google.com/photos/about/) or [Unsee](https://unsee.cc), but note that some public images may not work with CardPen due to CORS issues.  (Click the `BGG` button for an example of using a CORS proxy to work around CORS issues.)

If you need lots of images or if you're having CORS issues, you should run CardPen locally.
Put your images in the images directory and refer to them as the examples do.
(See `BGGLocalImages.json` for an example.)

#### BGG

CardPen can generate a special card list from your [BoardGameGeek](https://boardgamegeek.com) game collection for making an [I Don't Know, What Do You Want to Play?](https://boardgamegeek.com/boardgame/28567/i-dont-know-what-do-you-want-play) deck or for similar purposes.
To generate the list, click the **BGG** button under Project.  Optionally, edit the sample template and CSS to set up the cards the way you want.

Next, open the Advanced view and enter your own username in the **BGG username** field.  Click the **Get Games** button; this will replace the sample card list with one based on your own game collection.

### Output Format

You have three card generation options under Format:

* The **HTML** button generates an HTML preview.
* The **Print** button prints the HTML page (for DIY cards).
* The **Images** button generates individual PNG images of your cards for uploading to a commercial card printing site.

#### Printing HTML

Before printing, choose the appropriate page size for your paper (in the Advanced view).
Your cards may fit better in one direction than the other, so try switching from landscape to portrait or back before printing.

The **Print** button prints the cards; in some browsers you can also right-click on the frame and choose Print Frame from the context menu.

When printing HTML, be sure to uncheck or undo any scaling as well as removing any headers/footers that the browser might add.
Some browsers will not detect your choice of landscape or portrait for your page layout,
so you may need to set that manually in the print dialog before printing.

##### Cut Lines

The **cutline** checkbox (in the Advanced view) is for adding a cut line when printing cards yourself, not for making borders.

(Making actual thick borders around a card is not generally recommended and so is not automated by CardPen, though you can do it using your CSS.  When making your own borders around cards despite all warnings, some recommend that the border extend about 1/8" into the safe zone.)

#### Generating Images

Due to browser security settings affecting the library that CardPen uses to generate images, not all browsers will generate cards as images.  Safari will not, nor will any iOS browser; Chrome generally will.

When generating images, choose an adequate DPI (300 is the default and is most printers' minimum), then click the **Images** button under Format.  The images will appear in the output section of the page, with a **Zip Images** button above them.  To download the images as a zip file, click the button.
The images inside the zip file will be named after your project and numbered sequentially.

Some browsers will display the images at a strangely small resolution; in that case, right-click on an image to open it in a new tab (then, additionally, zoom in if your browser is zoomed out) in order to see the image at its real pixel size.  (You don't need to do anything special to zip such images.)

Image generation is a dark art that sometimes goes wrong;
if something else looks awry or if you get a failure message, try again.

##### Rotating Images

If you need to rotate your landscape cards back to portrait to upload to a printer, I recommend using [ImageMagick](https://www.imagemagick.org/script/index.php).  The relevant command is:

`convert -rotate "90" <filename>.png <newfilename.png>`

You probably want to rotate the back in the opposite direction:

`convert -rotate "-90" <filename>.png <newfilename.png>`

It's easier to just edit the files in place (as long as you've saved your project and can regenerate them if something goes wrong):

`mogrify -rotate "90" *.png`

#### Saving

CardPen stores your current card edits in your browser's local storage, so you can come back to it in the same browser later on (but not forever, and not if you overwrite it with another set of cards).

For longer-term storage, use the **Export** button (next to your project name in the Advanced view) to save your card project as a json file.  You can load the saved file again later using the **Load** button under Project.  You can also load the extra examples from the examples directory this way.

## Which

The **Show All** button next to the card sizes will show you all the built-in card sizes using your current settings for bleed and card orientation, including conversion to millimeters, inches, and pixels.  You should always double-check your card sizes rather than relying on card size names, which can vary strangely from publisher to publisher.

### Card Size Clarifications

* When in doubt, the size is poker.
* Sometimes poker size is described as "Standard Game" or "Standard Card Game", and bridge size as "Standard American" or "American Board Game" for the purposes of sleeving, but these are not to be confused with the actual panoply of weird "game" sizes.
* Magic the Gathering cards are Euro Poker size.  They're sometimes described as poker size, but that's just a rounding error.  The original ("Alpha") printing may have actually been poker sized.
* Euro Mini (44mm x 67mm) is sometimes listed in US sizes as 1.73" x 2.64".
* *Skinny Mini* is a nickname for the Fantasy Flight/DriveThruCards size of 1 5/8" x 2 1/2", also known as Mini American; more commonly Mini means 1 3/4" x 2 1/2" instead.  (Bicycle claims "mini" is actually 1 11/16" x 2 3/8", but no one prints that size.)
* *Cow Mini* is a nickname for ArtsCow's weird mini size (h/t [this BGG thread](https://boardgamegeek.com/thread/759945/artscow-mini-playing-cards-size-vs-ideal-image-siz) about some old typos at ArtsCow).
* *Game* is the size of, *e.g.*, Fluxx cards, and is sometimes listed in US sizes as 2.20472" x 3.4252".
* Square (2.75") is sometimes listed as 2 11/16" or 70mm for the purposes of sleeving.
* Small Memo is a larger square (3.75").
* Business is sometimes called Biz or Question.

Some sizes are included because sleeves for them are common, though no one will print them for you---most notably, euroGame and euroMiniGame.

## Whence

Not all card printing services accept PNG files, but many do.

### Card Printing Services

* [ArtsCow](http://www.artscow.com/) prints a handful of card sizes and shapes.  (Beware their weird minis!)   Not all their offerings let you set up more than one back, and some come with a pre-configured suit that you will probably need to remove from the cards.  On the bright side, they have enticing sale prices and they also print memo pads, which may be useful for scorepads.  [Rumor has it](https://boardgamegeek.com/thread/1760777/how-make-score-pad) that you can also get scorepads printed at some FedEx Office (Kinkos) locations.
* [The Game Crafter](https://www.thegamecrafter.com)'s card sizes are listed [here](http://help.thegamecrafter.com/article/85-cards).  They recently added [Euro Poker](https://www.thegamecrafter.com/publish/product/EuroPokerDeck) size.
* [Make Playing Cards](http://www.makeplayingcards.com/)' card sizes and prices are [here](http://www.makeplayingcards.com/low-price-for-bulk.aspx); they also make custom poker chips.
* [Printer's Studio](http://www.printerstudio.com/)'s card sizes are listed [here](http://www.printerstudio.com/unique-ideas/blank-playing-cards.html).  They also make a large variety of game mats.
* [Superior Pod](http://www.superiorpod.com/) doesn't have a single list, but their sizes seem to be poker, bridge, mini, question, 3.5" square and tarot.  Their submission requirements are [somewhat unclear](http://support.superiorpod.com/customer/en/portal/articles/2727142-file-submission-guidelines-for-card-decks) but seem to include a zip file of individual image files.  There's a [long BGG thread](https://boardgamegeek.com/thread/427619/superior-pod-thread/) about them you might want to read first.

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
* [Ultimate Guard sleeves](http://www.ultimateguard.com/en/card-sleeves.html)
* [Ultra PRO sleeves](http://www.ultrapro.com/product_list.php?cPath=70) are called *deck protectors*.

## Whether

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
The code and more details are available at [bitbucket](https://bitbucket.net/mcdemarco/cardpen/).

CardPen is licensed under the GNU General Public License v3.0.

## When

&copy;2017
