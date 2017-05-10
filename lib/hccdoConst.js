// constants for hccdo by mcdemarco

  //var corsProxy = "https://crossorigin.me/"; //has file size limitations, so switched to:
  var corsProxy = "https://cors-anywhere.herokuapp.com/";
	var ins = "in";
	var mms = "mm";
	var pxs = "px";
	var cardSizes = {
		custom: [0,0,mms], // [height,width,units]
		poker: [3.5,2.5,ins], //[88.9,63.5] traditional
		euroPoker: [88,63,mms],
		bridge: [3.5,2.25,ins],//88,56 [89,57]
		micro: [1.75,1.25,ins],
		skinnyMini: [2.5,1.625,ins],
		mini: [2.5,1.75,ins],
		euroMini: [67,44,mms], //[2.64,1.73,ins],
		euroMiniGame: [68,44,mms], //2 5/8", 1 11/16" 
		cowMini: [2.75,2,ins],
		small: [3,2,ins],
		tarot: [4.75,2.75,ins],
		game: [87,56,mms], //[3.4252,2.20472,ins],
		euroGame: [92,59,mms],
		trump: [100,62,mms], //[3.95,2.45]
		domino: [3.5,1.75,ins],
		business: [3.5,2,ins],
		smallIndex: [4.5,3,ins],
		index: [5,3,ins],
		largeIndex: [5.5,3,ins],
		large: [5,3.5,ins],
		large2: [5.75,3.5,ins],
		jumbo: [5.5,3.5,ins],
		giant: [7,5,ins],
		miniSquare: [2,2,ins],
		smallerSquare: [2.5,2.5,ins],
		smallSquare: [2.75,2.75,ins],// [70,70,mms]
		square: [3,3,ins],
		largerSquare: [3.5,3.5,ins],
		largeSquare: [4.75,4.75,ins],
		squareTile: [6,6,ins],
		tile: [10,8,ins],
		circle: [3.5,3.5,ins],
		hex: [3.75,3.25,ins],
		heart: [3,3.25,ins],
		smallMemo: [3.75,3.75,ins],
		largeMemo: [5.5,4.125,ins],
		letter: [11,8.5,ins],
		a4: [297,210,mms],
		legal: [14,8.5,ins],
		a3: [420,297,mms],
		ledger: [17,11,ins],
		pokerChip: [39,39,mms]
	};

	var roundSizes = ["circle","pokerChip"];
	var paperSizes = ["letter","a4","legal","a3","ledger"];

	var blankForm = {
		name: '',
		notes: '',
		dpi: 300,
		live: false,
		psize: 'letter',
		pori: 'landscape',
		csize: 'poker',
		cori: 'portrait',
		cheight: '',
		cwidth: '',
		cunit: 'mm',
		ccircle: false,
		gsize: 0,
		gunit: 'mm',
		blsize: 0,
		blunit: 'in',
		ssize: 0,
		sunit: 'in',
		cutline: true,
		bradius: 0.125,
		brunit: 'in',
		overlay: false,
		extCSS: '',
		css: '',
		csv: '',
		mustache: '',
		cardClass: ''
	};

	var exampleForm = {
		name: 'Pico',
		notes: 'Pico is an out-of-print mini game by Doris & Frank.  I picked it for the basic HCCDo example because it has only 11 (very simple) cards.  Note that there is a rebalanced sequel, Pico 2; if you need English rules for Pico, they can be inferred from the rules for Pico 2.\nPublisher site: http://doris-frank.de/GamesPico.html\nBoardGameGeek entries: https://boardgamegeek.com/boardgame/2051/pico https://boardgamegeek.com/boardgame/606/pico-2',
		dpi: 300,
		live: false,
		psize: 'letter',
		pori: 'landscape',
		csize: 'poker',
		cori: 'portrait',
		cheight: '',
		cwidth: '',
		cunit: 'mm',
		ccircle: false,
		gsize: 1,
		gunit: 'mm',
		blsize: 0.12,
		blunit: 'in',
		ssize: 0.12,
		sunit: 'in',
		cutline: true,
		bradius: 0.125,
		brunit: 'in',
		overlay: true,
		extCSS: 'https://fonts.googleapis.com/css?family=Raleway|Delius+Swash+Caps&effect=shadow-multiple',
		css: ".wrapper {\n\tdisplay: flex;\n\tflex: 1;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: Raleway, sans-serif;\n\tfont-size: 14pt;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.corner {\n\tdisplay: flex;\n\talign-items: flex-start;\n\tflex-direction: row;\n\tfont-weight: 600;\n\tpadding: 5pt 7pt;\n}\n.score {\n\tcolor:red;\n\ttext-align:center;\n\twidth: 90%;\n\tfont-size: 8pt;\n\tpadding: 2pt;\n}\n\n.score1::before {content: \" \\2b24 \";} \n.score2::before {content: \" \\2b24  \\2b24 \";}  \n.score3::before {content: \" \\2b24  \\2b24  \\2b24 \";}\n.score4::before {content: \" \\2b24  \\2b24  \\2b24  \\2b24 \";}\n\n.reversed {\n\ttransform: rotate(180deg);}\n.main {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: flex-start;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: 'Delius Swash Caps', sans-serif;\n\tfont-size: 48pt;\n}",
		csv: 'Number,Score\n2,1\n3,1\n4,2\n5,2\n6,2\n7,2\n8,3\n9,3\n10,3\n13,3\n16,4',
		mustache: "<div class=\"wrapper\">\n\t<div class=\"corner\">{{Number}}<div class=\"score score{{Score}}\"></div>{{Number}}</div>\n\t<div class=\"main font-effect-shadow-multiple\">\n\t\t<div>{{Number}}</div>\n\t</div>\n\t<div class=\"corner reversed\">{{Number}}<div class=\"score score{{Score}}\"></div>{{Number}}</div>\n</div>",
		cardClass: ''
	};

	var idkForm = {
"name": "IDKWDYWTP Example",
		notes: "This is a set of ten preloaded games to show you how your own collection will look. Fill in your username and click the Get Games button (possibly twice), then Generate HTML to see your own games here.",
		dpi: 300,
		live: true,
		psize: "letter",
		pori: "landscape",
		csize: "poker",
		cori: "portrait",
		cheight: "",
		cwidth: "",
		cunit: "mm",
		ccircle: false,
		gsize: 1,
		gunit: "mm",
		blsize: 36,
		blunit: "px",
		ssize: 36,
		sunit: "px",
		cutline: false,
		bradius: 0.125,
		brunit: "in",
		overlay: false,
		extCSS: "https://fonts.googleapis.com/css?family=Raleway",
		css: ".wrapper {\n\tdisplay: flex;\n\tflex: 1;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: Raleway, sans-serif;\n\tfont-size: 11pt;\n\twidth: 100%;\n\theight: 100%;\n\toverflow: hidden;\n}\n\n.corner {\n\tfont-size: 13pt;\n\tfont-weight: 600;\n\twhite-space:nowrap;\n\ttransform: rotate(90deg) translateX(84%);\n\ttransform-origin: 90% 90%;\n}\n.corner.reversed {\n\ttransform: rotate(270deg) translateX(-8%);\n\ttransform-origin: 0 0;\n\tborder: 0\n}\n\ntable {\n\tbackground-color: #eee;\n\tpadding:3pt;\n\tborder-radius: 2pt;\n\tborder: 2px solid gray;\t\n}\nth {text-align: right;}\ntd {text-align: left;}\n\n.info {\n\tdisplay: flex;\n\tflex: 1;\n\tjustify-content: center;\n\talign-elements: center;\n\tmargin-top: -12pt;\n}\n\n.main {\n\tdisplay: flex;\n\tflex: 2;\n\tflex-direction: column;\n\talign-items: center;\n\tjustify-content: flex-end;\n\tmargin-bottom: -12pt;\n}\n\nimg {\n\tmax-height: 145pt;\n\tmax-width: 125pt;\n\tborder-radius: 2pt;\n}\n.cardImage img {\n\tmax-height: 135pt;\n}\n\n#thing159143 img {\n\tborder: 1px solid #bbb; /* for hue */\n}",
		csv: "thing\tname\tyear\tsrc\tminplayers\tmaxplayers\tplayers\tminplaytime\tmaxplaytime\tplaytime\trating\taverage\tbayesaverage\trank\n478\tCitadels\t2007\t//cf.geekdo-images.com/images/pic557411.jpg\t2\t8\t2&ndash;8\t20\t60\t20&ndash;60\t8\t7.1\t7.1\t279\n36218\tDominion\t2008\t//cf.geekdo-images.com/images/pic394356.jpg\t2\t4\t2&ndash;4\t30\t30\t30\t9\t7.7\t7.6\t56\n43015\tHansa Teutonica\t2009\t//cf.geekdo-images.com/images/pic839090.jpg\t2\t5\t2&ndash;5\t45\t90\t45&ndash;90\t8\t7.6\t7.4\t97\n63888\tInnovation\t2011\t//cf.geekdo-images.com/images/pic1440811.jpg\t2\t4\t2&ndash;4\t45\t60\t45&ndash;60\t\t7.3\t7.1\t245\n176494\tIsle of Skye: From Chieftain to King\t2015\t//cf.geekdo-images.com/images/pic2524838.jpg\t2\t5\t2&ndash;5\t30\t50\t30&ndash;50\t\t7.5\t7.3\t144\n163412\tPatchwork\t2014\t//cf.geekdo-images.com/images/pic2270442.jpg\t2\t2\t2\t15\t30\t15&ndash;30\t8\t7.8\t7.7\t43\n8217\tSan Juan\t2004\t//cf.geekdo-images.com/images/pic174174.jpg\t2\t4\t2&ndash;4\t45\t60\t45&ndash;60\t7\t7.3\t7.2\t194\n13\tThe Settlers of Catan\t2003\t//cf.geekdo-images.com/images/pic2730.jpg\t3\t4\t3&ndash;4\t60\t120\t60&ndash;120\t7\t7.3\t7.1\t233\n215\tTichu\t2007\t//cf.geekdo-images.com/images/pic577980.jpg\t3\t10\t3&ndash;10\t60\t60\t60\t8\t7.6\t7.4\t103\n9209\tTicket to Ride\t2004\t//cf.geekdo-images.com/images/pic38668.jpg\t2\t5\t2&ndash;5\t30\t60\t30&ndash;60\t8\t7.5\t7.4\t109",
		mustache: "<div class=\"wrapper\" id=\"thing{{thing}}\">\n\t<div class=\"corner\">{{name}}</div>\n\t<div class=\"info\">\n\t\t<table>\n\t\t\t<tr>\n\t\t\t\t<th>Players:</th><td>{{{players}}}</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<th>Time:</th><td>{{{playtime}}} min</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<th>Rating:</th><td>{{average}}</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<th>Rank:</th><td>{{rank}}</td>\n\t\t\t</tr>\n\t\t</table>\n\t</div>\n\t<div class=\"main\">\n\t\t<img src=\"{{#cardImage}}" + corsProxy + "https:{{/cardImage}}{{src}}\">\n\t</div>\n\t<div class=\"corner reversed\">{{year}}</div>\n</div>",
		cardClass: ''
	};
