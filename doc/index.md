# Help using HCCDo

HCCDo generates simple HTML pages of cards for printing your cards up yourself,
or it can convert your cards to images at any DPI for uploading to a printing service like ArtsCow.
(Note that some printers require inDesign or other formats, and HCCDo won't help you there.)

HCCDo assumes that you know your way around HTML but not around inDesign.

## How To

To see your current cards (or the example set of Pico cards), click *Generate HTML*.
To see this help page again, click *Help*.

Your cards are assembled from a card list, a Mustache template, and (optionally) additional CSS styles.

### The Card List

You can upload a CSV file containing all the information about your cards, or type them in manually.

The first line of your card list should be a header with short names for each of your columns.
Each remaining line should have the same number of columns (you can leave some blank), and should describe one card from your set.

### The Template

You can upload a Mustache template or type it in manually.

The template is mostly plain HTML laying out a single card from your set.  To insert card-specific information, use Mustache braces around one of your column titles from your card list.  In the Pico example, there is only one column, named *Number*, and the card's number is inserted in three places on the card: the center and the two corners.

### The Styles

You can upload a CSS file or type it in manually.

The example uses flexbox styles to position the card elements, but you can use tables or any other approach you like.
You can put all styling information inline in the template, or set classes on your template and define them here.

You should use print units like *in*, *mm*, or *pt* (points) in order to keep your output true to the chosen card size.

#### Fonts

You can add Google Fonts or other fonts (*e.g.*, [FontAwesome](https://www.bootstrapcdn.com/fontawesome/)) using the *External Stylesheet* setting.  [FontCDN](http://fontcdn.org) is a handy way to search for Google Fonts.

### The Settings

The most important setting is card size, which defaults to *poker*.

You can change the orientation of your cards to *landscape*; the default is *portrait*.



## Printing or Saving

HCCDo stores your current card setup in local storage, so you can come back to it in the same browser later on (but not forever).

### Printing HTML

Before printing, choose the page size for your paper.  Your cards may fit better in one direction than the other, so try switching from landscape to portrait or back before printing.

The *Print* button prints the cards; in some browsers you can also right-click on the frame and choose Print Frame from the context menu.

When printing HTML, be sure to uncheck or undo any scaling as well as removing any headers/footers that the browser might add.
Some browsers will not detect your choice of landscape or portrait for your page layout,
so you may need to set that manually in the print dialog before printing.

### Generating Images

Not all browsers can generate images; Safari will not, nor will any iOS browser.  Any other version of Chrome will.

When generating images, choose an adequate DPI (300 is most printers' minimum), then click *Generate Images*.  The images will appear in this section of the page, with a *Zip Images* button above them.  To download them, click the button.


## More Information

### Card Size Clarification

* When in doubt, the size is poker.
* Sometimes poker size is described as "Standard Game" or "Standard Card Game", and bridge size as "Standard American" or "American Board Game" for the purposes of sleeving, but these are not to be confused with the actual panoply of weird "game" sizes.
* Euro Mini (44mm x 67mm) is sometimes listed in US sizes as 1.73" x 2.64".
* Skinny Mini is the Fantasy Flight/DriveThruCards size of 1 5/8" x 2 1/2", also known as Mini American; more commonly Mini means 1 3/4" x 2 1/2" instead.  (Bicycle claims "mini" is actually 1 11/16" x 2 3/8", but no one prints that size.)
* Game is the size of, *e.g.*, Fluxx cards, and is sometimes listed in US sizes as 2.20472" x 3.4252".
* Square (2.75") is sometimes listed as 2 11/16" or 70mm for the purposes of sleeving.
* Small Memo is a larger square (3.75").

Some sizes are listed because sleeves for them are common, while no one prints them--most notably, euroGame and euroMiniGame.


### Card Printing Services

* [ArtsCow](http://www.artscow.com/) prints several formats of cards, plus memo pads (for scorepads).  [Rumor has it](https://boardgamegeek.com/thread/1760777/how-make-score-pad) that you can also get scorepads printed at some FedEx Office (Kinkos) locations.
* [DriveThruCards](http://www.drivethrucards.com)' supported formats and costs are listed [here](https://onebookshelfpublisherservice.zendesk.com/hc/en-us/articles/227867627-Printed-Card-Formats-Costs).  Beware of their skinny minis!
* [The Game Crafter](https://www.thegamecrafter.com)'s card sizes are listed [here](http://help.thegamecrafter.com/article/85-cards)
* [Make Playing Cards](http://www.makeplayingcards.com/)' card sizes and prices are [here](http://www.makeplayingcards.com/low-price-for-bulk.aspx); they also make custom poker chips.
* [Printer's Studio](http://www.printerstudio.com/)'s card sizes are listed [here](http://www.printerstudio.com/unique-ideas/blank-playing-cards.html).  They also make a large variety of game mats.

### Sleeves

Sleeves are a cheap way to mock up a card game.  Sleeve your printouts in front of actual cards, or use thicker paper or opaque sleeves for the best results.

* [Fantasy Flight sleeves](https://www.fantasyflightgames.com/en/products/fantasy-flight-supply/)
* [Mayday Games' sleeves](https://www.maydaygames.com/collections/card-sleeves)
* [Ultimate Guard sleeves](http://www.ultimateguard.com/en/card-sleeves.html)
* [Ultra PRO sleeves](http://www.ultrapro.com/product_list.php?cPath=70) are called *deck protectors*.

## Credits

HCCDo was inspired by [hccd](https://github.com/vaemendis/hccd/).  The code and more details are available at [bitbucket](https://bitbucket.org/mcdemarco/hccdo/overview).
