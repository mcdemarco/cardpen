// constants for hccdo by mcdemarco

	var ins = "in";
	var mms = "mm";
	var pxs = "px";
	var cardSizes = {
		custom: [0,0,mms],
		poker: [3.5,2.5,ins], //[88.9,63.5] traditional
		euroPoker: [88,63,mms],
		bridge: [3.5,2.25,ins],//88,56 [89,57]
		micro: [1.75,1.25,ins],
		skinnyMini: [2.5,1.625,ins],
		mini: [2.5,1.75,ins],
		euroMini: [67,44,mms], //[2.64,1.73,ins],
		euroMiniGame: [68,44,mms], //2 5/8", 1 11/16" 
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
		mustache: ''
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
		blsize: 0.125,
		blunit: 'in',
		ssize: 0.125,
		sunit: 'in',
		cutline: true,
		bradius: 0.125,
		brunit: 'in',
		overlay: true,
		extCSS: 'https://fonts.googleapis.com/css?family=Raleway|Delius+Swash+Caps&effect=shadow-multiple',
		css: ".wrapper {\n\tdisplay: flex;\n\tflex: 1;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: Raleway, sans-serif;\n\tfont-size: 14pt;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.corner {\n\tdisplay: flex;\n\talign-items: flex-start;\n\tflex-direction: row;\n\tfont-weight: 600;\n\tpadding: 5pt 7pt;\n}\n.reversed {\n\ttransform: rotate(180deg);\}\n.main {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: flex-start;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: 'Delius Swash Caps', sans-serif;\n\tfont-size: 48pt;\n}\n\n",
		csv: 'Number\n2\n3\n4\n5\n6\n7\n8\n9\n10\n13\n16',
		mustache: '<div class="wrapper">\n\t<div class="corner">{{Number}}</div>\n\t<div class="main font-effect-shadow-multiple">\n\t\t<div>{{Number}}</div>\n\t</div>\n\t<div class="corner reversed">{{Number}}</div>\n</div>'
	};

	var idkForm = {
		name: "IDKWDYWTP Example",
		notes: "This is a set of ten preloaded games to show you how your own collection will look. Fill in your username and click the Get Games button (possibly twice), then Generate HTML to see your own games here.",
		dpi: 300,
		live: false,
		psize: "letter",
		pori: "landscape",
		csize: "poker",
		cori: "landscape",
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
		css: ".wrapper {\n\tdisplay: flex;\n\tflex: 1;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: Raleway, sans-serif;\n\tfont-size: 11pt;\n\twidth: 100%;\n\theight: 100%;\n\toverflow: hidden;\n}\n\n.corner {\n\tdisplay: flex;\n\talign-items: flex-start;\n\tjustify-content: flex-start;\n\tflex-direction: column;\n\tfont-size: 14pt;\n\tfont-weight: 600;\n\tpadding: 2pt 4pt;\n}\n.reversed {\n\ttransform: rotate(180deg);\n}\n.main {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: flex-start;\n\tflex-direction: column;\n\tjustify-content: space-between;\n}\n\nimg {\n\tmax-height: 120pt;\n\tmax-width: 225pt;\n\tborder-radius: 2pt;\n}\n#thing159143 img {\n\tborder: 1px solid #bbb; /* for hue */\n}",
		csv: "thing\tname\tyear\tsrc\tminplayers\tmaxplayers\tplayers\tminplaytime\tmaxplaytime\tplaytime\trating\taverage\tbayesaverage\trank\n478\tCitadels\t2007\texamples/images/pic557411.jpg\t2\t8\t2&endash;8\t20\t60\t20&endash;60\t8\t7.14757\t7.05966\t279\n36218\tDominion\t2008\texamples/images/pic394356.jpg\t2\t4\t2&endash;4\t30\t30\t30\t9\t7.70045\t7.60765\t56\n43015\tHansa Teutonica\t2009\texamples/images/pic839090.jpg\t2\t5\t2&endash;5\t45\t90\t45&endash;90\t8\t7.63863\t7.42735\t97\n63888\tInnovation\t2011\texamples/images/pic1440811.jpg\t2\t4\t2&endash;4\t45\t60\t45&endash;60\t\t7.26141\t7.10808\t245\n176494\tIsle of Skye: From Chieftain to King\t2015\texamples/images/pic2524838.jpg\t2\t5\t2&endash;5\t30\t50\t30&endash;50\t\t7.52414\t7.29989\t144\n163412\tPatchwork\t2014\texamples/images/pic2270442.jpg\t2\t2\t2\t15\t30\t15&endash;30\t8\t7.83188\t7.69507\t43\n8217\tSan Juan\t2004\texamples/images/pic174174.jpg\t2\t4\t2&endash;4\t45\t60\t45&endash;60\t7\t7.29709\t7.19206\t194\n13\tThe Settlers of Catan\t2003\texamples/images/pic2730.jpg\t3\t4\t3&endash;4\t60\t120\t60&endash;120\t7\t7.26589\t7.12516\t233\n215\tTichu\t2007\texamples/images/pic577980.jpg\t3\t10\t3&endash;10\t60\t60\t60\t8\t7.60919\t7.41514\t103\n9209\tTicket to Ride\t2004\texamples/images/pic38668.jpg\t2\t5\t2&endash;5\t30\t60\t30&endash;60\t8\t7.48307\t7.38904\t109",
		mustache: "<div class=\"wrapper\" id=\"thing{{thing}}\">\n\t<div class=\"corner\">{{name}}</div>\n\t<div class=\"main\">\n\t\t<img src=\"{{src}}\">\n\t</div>\n\t<div class=\"corner reversed\">{{name}}</div>\n</div>"
	};

