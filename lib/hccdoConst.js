// constants for hccdo by mcdemarco

	var ins = "in";
	var mms = "mm";
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
		dpi: 96,
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
		border: true,
		overlay: false,
		extCSS: '',
		css: '',
		csv: '',
		mustache: ''
	};

var examples = [
	{
		name: 'Pico',
		dpi: 96,
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
		blsize: 0.25,
		blunit: 'in',
		ssize: 0.25,
		sunit: 'in',
		border: true,
		overlay: true,
		extCSS: 'https://fonts.googleapis.com/css?family=Raleway|Delius+Swash+Caps&effect=shadow-multiple',
		css: ".wrapper {\n\tdisplay: flex;\n\tflex: 1;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: Raleway, sans-serif;\n\tfont-size: 14pt;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.corner {\n\tdisplay: flex;\n\talign-items: flex-start;\n\tflex-direction: row;\n\tfont-weight: 600;\n\tpadding: 5pt 7pt;\n}\n.reversed {\n\ttransform: rotate(180deg);\}\n.main {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: flex-start;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: 'Delius Swash Caps', sans-serif;\n\tfont-size: 48pt;\n}\n\n",
		csv: 'Number\n2\n3\n4\n5\n6\n7\n8\n9\n10\n13\n16',
		mustache: '<div class="wrapper">\n\t<div class="corner">{{Number}}</div>\n\t<div class="main font-effect-shadow-multiple">\n\t\t<div>{{Number}}</div>\n\t</div>\n\t<div class="corner reversed">{{Number}}</div>\n</div>'
	},
	{		
		name: 'ssbacks',
		dpi: 96,
		live: true,
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
		blsize: 0.24,
		blunit: 'in',
		ssize: 0.24,
		sunit: 'in',
		border: true,
		overlay: true,
		extCSS: 'https://fonts.googleapis.com/css?family=Cabin',
		css: '.card {\n\tfont-family: RennieMackintoshITC, Cabin, sans-serif;\n\tfont-size: 18pt;\n\tbackground-repeat: repeat;\n}\n\n.card1 {\n\tbackground-image: url(examples/ssbacks_1.jpg);\n\tbackground-size: 100mm 100mm; \n\tbackground-position: 20mm 34mm; \n}\n\n.card2 {\n\tbackground-image: url(examples/ssbacks_2.jpg);\n\tbackground-size: 100mm 100mm;\n\tbackground-position: 8mm 12mm;\n\n}\n\n.glass {\n\tdisplay: flex;\n\talign-items: center;\n\tflex-direction: column;\n\tjustify-content: center;\n\ttext-align:center;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-size: 80mm 80mm; \n\tbackground-repeat: no-repeat;\n\tbackground-position: -14.5mm 20mm;\n}\n\n.card1 .glass {\n\tbackground-image: url(examples/ssbacks_glass1.svg);\n}\n\n.card2 .glass {\n\tbackground-image: url(examples/ssbacks_glass2.svg);\n}\n\n.subtitle {\n\tfont-family: Cabin, sans-serif;\n\tfont-size: 12pt;\n}',
		csv: 'Back,Info\n1,Dance Deck\n2,Clue Deck',
		mustache: '<div class="glass">\n\tScottish Sleuth\n\t<div class="subtitle">{{Info}}</div>\n</div>\n'
	},
	{
		name: 'ssclues',
		dpi: 96,
		live: true,
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
		blsize: 0,
		blunit: 'in',
		ssize: 0,
		sunit: 'in',
		border: true,
		overlay: false,
		extCSS: 'https://fonts.googleapis.com/css?family=Cabin|Cherry+Swash|Fontdiner+Swanky|Italianno|Raleway|Sriracha',
		css: ".card {\n\tdisplay: flex;\n\tjustify-content: center;\n\tfont-family: Raleway, sans-serif;\n\tfont-size: 14pt;\n\tbackground-image: url(examples/ssclues_bg.svg);\n\tbackground-size: 72mm 72mm; \n\tbackground-repeat: no-repeat;\n\tbackground-position: -16mm 19mm;\n}\n.card.Drewry {\n\tcolor: blue;\n\tbackground-image: url(examples/ssclues_bg_blue.svg);\n}\n.card.Foss {\n\tcolor: green;\n\tbackground-image: url(examples/ssclues_bg_green.svg);\n}\n.card.Goldring {\n\tcolor: red;\n\tbackground-image: url(examples/ssclues_bg_red.svg);\n}\n.info {\n\tdisplay: flex;\n\talign-items: center;\n\tflex-direction: column;\n\tjustify-content: center;\n}\n.Jigs.tempo {\n\tfont-family: 'Fontdiner Swanky', cursive;\n\tfont-size: 18pt;\n}\n.Strathspeys.tempo {\n\tfont-family: Italianno, cursive;\n\tfont-weight: bold;\n\tfont-size: 28pt;\n}\n.Reels.tempo {\n\tfont-family: 'Cherry Swash', cursive;\n\tfont-weight: bold;\n\tfont-size: 22pt;\n}\n\n.Drewry.corner::after {\n\tcontent: 'D';\n}\n.Foss.corner::after {\n\tcontent: 'F';\n}\n.Goldring.corner::after {\n\tcontent: 'G';\n}\n.text {\n\tfont-size: 16pt;\n}\n.devisor {\n\tfont-family: Cabin, sans-serif;\n\tfont-size: 16pt;\n}\n.count {\n\tfont-size: 20pt;\n\tfont-weight: 500;\n}\n.uncolored {\n\tcolor: black;\n}\n.special {\n\tfont-family: Sriracha, cursive;\n\tfont-size: 16pt;\n\tline-height: 0.8;\n}",
		csv: 'Special,Tempo,Couples,CardClass\nFree choice,,,\nFree choice,Jigs,,\nFree choice,Strathspeys,,\nFree choice,Reels,,\nFree choice,,2,\nFree choice,,3,\nFree choice,,4,\nFree choice,,5,\nFree choice,,,Drewry\nFree choice,,,Foss\nFree choice,,,Goldring\n,Jigs,,\n,Strathspeys,,\n,Reels,,\n,,2,\n,,3,\n,,4,\n,,5,\n,,,Drewry\n,,,Foss\n,,,Goldring\n,Jigs,2,\n,Jigs,3,\n,Jigs,4,\n,Jigs,5,\n,Jigs,,Drewry\n,Jigs,,Foss\n,Jigs,,Goldring\n,Strathspeys,2,\n,Strathspeys,3,\n,Strathspeys,4,\n,Strathspeys,5,\n,Strathspeys,,Drewry\n,Strathspeys,,Foss\n,Strathspeys,,Goldring\n,Reels,2,\n,Reels,3,\n,Reels,4,\n,Reels,5,\n,Reels,,Drewry\n,Reels,,Foss\n,Reels,,Goldring\n,,2,Drewry\n,,2,Foss\n,,2,Goldring\n,,3,Drewry\n,,3,Foss\n,,3,Goldring\n,,4,Drewry\n,,4,Foss\n,,4,Goldring\n,,5,Drewry\n,,5,Foss\n,,5,Goldring',
		mustache: '<div class="info">\n\t{{#Special}}\n\t\t<div class="uncolored special">{{Special}}</div>\n\t{{/Special}}\n\t{{#Couples}}\n\t\t<div class="uncolored"><span class="count">{{Couples}}</span>-couple</div>\t\t\t\n\t{{/Couples}}\n\t{{#CardClass}}\n\t\t<div class="devisor {{CardClass}}">{{CardClass}}</div>\n\t{{/CardClass}}\n\t{{#Tempo}}\n\t\t<div class="uncolored tempo {{Tempo}}">{{Tempo}}</div>\n\t{{/Tempo}}\n\t{{^Tempo}}{{#Couples}}{{#CardClass}}\n\t\t<div>dances</div>\n\t{{/CardClass}}{{/Couples}}{{/Tempo}}\n\t{{^Tempo}}{{^Couples}}{{#CardClass}}\n\t\t<div>dances</div>\n\t{{/CardClass}}{{/Couples}}{{/Tempo}}\n\t{{^Tempo}}{{#Couples}}{{^CardClass}}\n\t\t<div>dances</div>\n\t{{/CardClass}}{{/Couples}}{{/Tempo}}\n</div>\n'
	}
];

var exampleForm = examples[0];
