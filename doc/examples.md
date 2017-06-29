# CardPen Examples

## Pico

The Pico example is the base example; it also has an oval variant.  Pico demonstrates how to make a basic, numerical card set in CardPen, with some additional information encoded as pips.  The oval variant is more fun than educational.

![Pico Card](../images/Pico008.png) ![Pico Oval Card](../images/PicoOval008.png)


### Notes

Pico is an out-of-print mini game by Doris & Frank.  I picked it for the basic CardPen example because it has only 11 (very simple) cards.  Note that there is a rebalanced sequel, Pico 2; if you need English rules for Pico, they can be inferred from the rules for Pico 2.

* [Publisher site](http://doris-frank.de/GamesPico.html)
* BoardGameGeek entries: [Pico](https://boardgamegeek.com/boardgame/2051/pico), [Pico 2](https://boardgamegeek.com/boardgame/606/pico-2)

## Xendo

Xendo is an example of cards using the **Rowsets** functionality (in sets of 3), where you can use more than one line from your "card" list on each card, as well as the `{{@index}}` tag to add a different bullet-type image next to each line.  The example uses the **cycle** setting for **Rowsets** in order to get three rules of increasing difficulty onto the cards.  The **random** setting for **Rowsets** would have made the difficulty unpredictable, while the **bunch** setting would have grouped rules of similar difficulty on each card.

There's also a separate, simple Xendo card back example.

![Xendo Cards](../images/XendoCards.png)

The pictured cards were printed at ArtsCow; it's not clear from the photo, but the originally solid purple background came out with a bit of a line across it that could matter if the cards were for a normal card game (but doesn't matter at all in Zendo).

### Notes

Xendo is a set of [Zendo](https://boardgamegeek.com/boardgame/6830/zendo) cards for use with Xeno pyramids instead of the traditional Rainbow pyramids.  Zendo cards list possible "rules" for new players; Zendo is an induction game where the other players try to guess the "rule" chosen by the "master".  Existing sets of Zendo cards all mentioned the Rainbow colors, so I made this set with Xeno colors.

The rule list is derived from [Jacob Davenport's](http://www.playagaingames.com/games/zendo_some_rules/"), a list of Zendo rules in order by difficulty.  I switched the colors before turning the list into a "card" list.  The pyramid images used for bullet points are from [Lou Lessing's Pyramid Arcade Font](http://www.looneylabs.com/other-pyramid-games). 

## BGG

The BGG examples show how to use the BoardGameGeek API functionality within CardPen to make cards out of your BGG collection.

![BGG Card](../images/BGGExampleLocalImages009.png)

There are two examples: one with the images hosted locally at CardPen, and one that uses the remote images at BGG.  The non-local example also includes some tweaking necessary when retrieving images from a site that does not have CORS configured correctly; the tweaks use the `{{cardImage}}` tag and a CORS proxy server.

## Scottish Sleuth

Scottish Sleuth is a collection of pieces of a rethemed game I published privately, mostly through [The Game Crafter](https://www.thegamecrafter.com/publish/products) though I printed the cards through ArtsCow.  They show more complicated (but still mostly text-based) cards and backs, how to make a box using overlays, various sizes of scorepad (requiring rotation), and a set of rules.

### Cards and Backs

The Scottish Sleuth card backs use two background images, one for the plaid (on the *card* element) and one for the magnifying glass (on the *bleed* element).
The card faces are similar, but without the plaid background.

### Box

### Scorepads

### Credits

The magnifying glass SVG is originally from [Game-icons.net](http://game-icons.net); I edited it manually.
I also made the player count/age/time icons on the box, partly manually and partly in [Boxy SVG](https://boxy-svg.com), an SVG editor for the Mac.
