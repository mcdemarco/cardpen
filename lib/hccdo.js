// hccdo by mcdemarco
// a pure-js, "online" version of hccd

//Todo: bleed, safe line
//      better weird card sizes (hex, heart)
//      custom circles
// allow multiple projects in UI and localStorage
// adjust page size for images (drop it) and for large card sizes (increase it)
// test firefox
// Add a card size display, possibly nested, with size translations.
// Better collapse iconography for hide/show?
// Switch to handlebars?

//init
//form
//load
//size
//write

var hccdo = {};

(function(context) { 

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
		small: [3,2],
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
		page: [11,8.5,ins],
		pokerChip: [39,39,mms]
	};

	var roundSizes = ["circle","pokerChip"];

context.init = (function () {

	return {
		start: start
	};

	function activate() {
		//Set up the buttons.
		document.getElementById("clear").addEventListener('click', hccdo.form.clear);
		document.getElementById("eg").addEventListener('click', hccdo.form.example);
		document.getElementById("help").addEventListener('click', hccdo.write.help);
		document.getElementById("hide").addEventListener('click', hccdo.form.toggle);
		document.getElementById("show").addEventListener('click', hccdo.form.toggle);
		document.getElementById("generate").addEventListener('click', hccdo.form.generate);
		document.getElementById("imagine").addEventListener('click', hccdo.form.generate);
		document.getElementById("print").addEventListener('click', hccdo.form.print);
		_.each(document.getElementsByClassName('upload'), function(el) { 
			el.addEventListener('change', hccdo.load.file);
		});
	}

	function fixTab() {
		//http://stackoverflow.com/a/18303822
		_.each(document.querySelectorAll("textarea"), function(elt) {
			elt.addEventListener('keydown',function(e) {
				if (e.keyCode === 9) { // tab was pressed
					// get caret position/selection
					var start = this.selectionStart;
					var end = this.selectionEnd;
					
					var target = e.target;
					var value = target.value;
					
					// set textarea value to: text before caret + tab + text after caret
					target.value = value.substring(0, start) + "\t" + value.substring(end);
					
					// put caret at right position again (add one for the tab)
					this.selectionStart = this.selectionEnd = start + 1;
					
					// prevent the focus lose
					e.preventDefault();
				}
			},false);
		});
	}

	function select() {
		//Populate the select with card sizes.
		var sizes = _.keys(cardSizes);
		var parent = document.getElementById("csize");
		_.each(sizes, function(size) {
			var opt = document.createElement('option');
			var dims = "";
			if (cardSizes[size][1] > 0)
				dims = " (" + cardSizes[size][1] + cardSizes[size][2] + " x " + cardSizes[size][0] + cardSizes[size][2] + ")";
			opt.value = size;
			opt.innerHTML = size + dims;
			parent.appendChild(opt);
		});
	}

	function start() {
		//Set up UI.
		select();
		activate();
		fixTab();

		//Load some data of some sort.
		context.load.stored();

		if (_.isEqual(cardForm.data, exampleForm)) {
			//Show the help.
			context.write.help();
		} else {
			//You've been here before!  We'll just show you your data.
			//Not sure about data quality, so wrap the attempt to process the data.
			try {
				context.write.generate(cardForm.data);
			} catch (e) {
				alert("Card generation failed.");
			}
		}
	}

})();

context.form = (function () {

	return {
		change: change,
		clear: clear,
		customSize: customSize,
		example: example,
		generate: generate,
		toggle: toggle,
		print: print
	};

	function change() {
		//Onchange function called by bind.  Beware the context change.
		if (!_.isEqual(this.data, blankForm) && !_.isEqual(this.data, exampleForm)) 
			context.load.save(this.data);
		if (this.data.live)
			context.write.generate(this.data,false);
		context.form.customSize(this.data);
		//For testing:
		//context.write.frame( JSON.stringify(this.__export(), '', 2) );
		//context.write.frame( JSON.stringify(this.data.cunit) );
	};

	function clear() {
		cardForm.data = blankForm;
		//Also clear iframe.
		clearFrame();
	}

	function customSize(data) {
		if (data.csize == "custom") {
			document.getElementById("customize").style.display = "inline";
		} else {
			document.getElementById("customize").style.display = "none";
		}
	};

	function example() {
		cardForm.data = exampleForm;
		clearFrame();
	}

	function generate(e) {
		//A wrapper that translates the event into the appropriate image setting.
		var forImage = (e && e.target && e.target.getAttribute("id") == "imagine");
		context.write.generate(cardForm.data,forImage);
	}

	function toggle(e) {
		//For hiding most of the form with the hide/show buttons.
		var hiding = (e && e.target && e.target.getAttribute("id") == "hide");
		var sectionNonArray = document.querySelectorAll("section");
		_.each(sectionNonArray, function(el) {
			if (el.id != "buttons")
				el.style.display = (hiding ? "none" : "flex");
		});
		document.getElementById("hide").style.display = (hiding ? "none" : "inline");
		_.each(document.getElementsByClassName("show"), function(el) {
				el.style.display = (hiding ? "" : "none");
		});
	}

	function print() {
		//Print iframe.
		var ifrm = document.getElementById("hccdoOutput");
		ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
		ifrm.print();
	}

	function clearFrame() {
		//Clear iframe.
		context.write.frame("");
	}


})();

context.load = (function () {

	//Data loading and storage functions.

	return {
		file: file,
		save: save,
		stored: stored
	};

	function file(e) {
		var uploader = e.target;
		//Load a css, csv, or mustache file using html5.
		var fileToLoad = uploader.files[0];
		var reader = new FileReader();
			
		reader.onload = function(e) {
			var type = uploader.getAttribute("data-type");
			cardForm.data[type] = reader.result;
			save(cardForm.data);
			context.write.generate(cardForm.data,false);
		};
		reader.onerror = function(e) {
			context.write.frame("<html>Unable to generate cards.</html>");
		};
		reader.readAsText(fileToLoad);
	}

	function save(data) {
		var stringyData = JSON.stringify(data);
		if (window.localStorage) {
			try {
				window.localStorage["hccdo"] = stringyData;
			} catch(e) {
				console.log("Error saving to local storage.");
			}
		}
	}

	function stored() {
		//Retrieve the data currently in localStorage, or the default data.
		if (window.localStorage && window.localStorage["hccdo"])
			try {
				cardForm.data = JSON.parse(window.localStorage["hccdo"]);
			} catch (e) {
				context.form.example();
			}
		else
			context.form.example();
	}

})();

context.size = (function () {

	return {
		card: card,
		grid: grid,
		gutter: gutter,
		page: page,
		radius: radius
	};

	//Sizing is returned as [h,w,unit].
	//The code default is portrait, reversed for landscape,
	//though the actual defaults differ for page and card.

	function card(data) {
		//Get sizing for the cards.
		var sizeArray;
		if (data.csize == 'custom')
			sizeArray = [data.cheight,data.cwidth,data.cunit];
		else
			sizeArray = cardSizes[data.csize];

		if (data.cori == 'landscape')
			sizeArray = _.chain(sizeArray).slice(0,2).reverse().push(sizeArray[2]).value();
		return sizeArray;
	}

	function gutter(data) {
		//Get sizing for the gutters.
		var marginSize = data.gsize/2;
		return [marginSize,marginSize,data.gunit];
	}

	function page(data) {
		//Get sizing for the page.
		var sizeArray = [];
		var pageSize = data.psize;
		if (pageSize == "letter") {
			sizeArray = [11,8.5,ins];//[279.4, 215.9,mms]
		} else {//a4
			sizeArray = [297,210,mms]; //[11.69,8.27,ins]
		}

		if (data.pori == 'landscape') {
			sizeArray = _.chain(sizeArray).slice(0,2).reverse().push(sizeArray[2]).value();
		}
		return sizeArray;
	}

	function grid(data) {
		//Get the number of rows and columns at the current card/page size: [r,c]
		var cardSize = card(data);
		var pageSize = page(data);
		var gutterSize = gutter(data);
		//If everything is not in same units, convert it all to mms.
		if (!(cardSize[2] == pageSize[2] && cardSize[2] == gutterSize[2])) {
			cardSize = convert2mm(cardSize);
			pageSize = convert2mm(pageSize);
			gutterSize = convert2mm(gutterSize);
		}
		var rolms = _.map([0,1], function(idx) {
			return Math.floor(pageSize[idx]/(cardSize[idx] + gutterSize[idx]));
		});
		return rolms;
	}

	function radius(data) {
		//Get sizing for the border radius, because of one special case.
		var sizeArray = [3,3,mms];
		if (_.contains(roundSizes,data.csize)) {
			var cardSize = card(data);
			sizeArray = [cardSize[0]/2,cardSize[1]/2,cardSize[2]];
		}
		return sizeArray;
	}

	function convert2mm(sizingArray) {
		//Convert from inches to mms (for cases when the sizes are not all using the same units),
		//if it's not already in the correct units.
		if (sizingArray[2] == mms)
			return sizingArray;
		else {
			var newSA = [];
			_.each([0,1],function(idx) {
				newSA[idx] = sizingArray[idx] * 25.4;
			});
			newSA[2] = mms;
			return newSA;
		}
	}

})();

context.write = (function () {

	return {
		frame: frame,
		generate: generate,
		help: help
	};

	function frame(doc) {
		var ifrm = document.getElementById("hccdoOutput");
		ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
		ifrm.document.open();
		ifrm.document.write(doc);
		ifrm.document.close();
	}

	function generate(data,forImages) {
		var cards;
		var externalLink = "";
		var templateOutput = "";
		var fullOutput = "";

		//Parse csv.
		cards = Papa.parse(data.csv, {
			header: true,
			skipEmptyLines: true
		});

		//Summon the goog.
		if (data.extCSS)
			externalLink = '\t<link href="' + data.extCSS +'" rel="stylesheet">';

		//Apply template.
		templateOutput = formatter(data,cards.data);

		//Assemble webpage.
		fullOutput = '<!DOCTYPE html>\n<html>\n<head>\n\t    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>\n';
		fullOutput += externalLink;
		//Prepare for image.
		if (forImages) {
			fullOutput += '    <script type="text/javascript" src="lib/dom-to-image.min.js"></script>\n';
			fullOutput += '    <script type="text/javascript" src="lib/FileSaver.min.js"></script>\n';
			fullOutput += '    <script type="text/javascript" src="lib/jszip.min.js"></script>\n';
			fullOutput += '    <script type="text/javascript" src="lib/hccdoImage.js"></script>\n';
			fullOutput += '    <script type="text/javascript">var dpi = ' + data.dpi + ';\n var projectName = "' + data.name + '";</script>\n';
			fullOutput += "<style>#hccdoutput {display: block;}</style>\n";
		} else {
			fullOutput += "<style>\n" + pageStyle(data) + "</style>\n";
		}
			fullOutput += "<style>\n" + cardStyle(data) + "</style>\n";
		fullOutput += "<style>\n" + data.css + "</style>\n</head>\n<body>\n";
		if (forImages) {
			fullOutput += "<button type='button' onclick='zipper();'>Zip Images</button>\n";
			fullOutput += "<div id='hccdoImages'></div>\n";
		}
		fullOutput += templateOutput + "\n</body>\n</html>\n";

		//Write to frame.
		context.write.frame(fullOutput);
	}

	function help() {
		//Show the help.
		//ToDo: convert to html.
		document.getElementById("hccdoOutput").src = "doc/index.md";
	}

	function cardStyle(data) {
		var cardSize = context.size.card(data);
		var gutterSize = context.size.gutter(data);
		var border = data.border; //Boolean
		var brSize = context.size.radius(data);
		var style = ".card {\n" +
					"    margin: " + gutterSize[0] + gutterSize[2] + ";\n" +
					"    border: 0" + (border ? ".8" : "") + "mm solid black;\n" +
					"    border-radius: " + brSize[0] + brSize[2] + ";\n" +
					"    background-clip: padding-box;\n" +
					"    height: " + cardSize[0] + cardSize[2] + ";\n" +
					"    width: " + cardSize[1] + cardSize[2] + ";\n" +
					"}\n";
		return style;
	}

	function pageStyle(data) {
		var pageSize = context.size.page(data);
		var style = "* {\n\tbox-sizing: border-box;\n}\nbody {\n\theight:" + pageSize[0] + pageSize[2] + ";\n\twidth:" + pageSize[1] + pageSize[2] + ";\n}\n" +
					".page {\n\tmargin-top: 15mm;\n\tborder: 0;\n\tpage-break-after: always;\n\t" +
					"display:flex;\n\tflex-direction:row;\n\tflex-wrap:wrap;\n\talign-items: center;\n\tjustify-content: center;\n}\n";
		return style;
	}

	function formatter(data,cards) {
		var template = '{{#hccdo}}<div class="card">\n' + data.mustache + "\n</div>{{/hccdo}}";
		var rolms = context.size.grid(data);
		var rows = rolms[0];
		var cols = rolms[1];
		var formatted = '';
		for (var c = 0; c < cards.length; c++) {
			if (c % (rows * cols) == 0) {
				if (c > 0) {
					formatted += '\n</div>\n';
				}
				formatted += '<div class="page">\n';
			}
			formatted += Mustache.to_html(template, {hccdo: cards[c]});
		}
		formatted += '</div></div>\n';
		return formatted;
	}

})();

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
		gsize: 0,
		gunit: 'mm',
		border: true,
		extCSS: '',
		css: '',
		csv: '',
		mustache: ''
	};

	var exampleForm = {
		name: 'example',
		dpi: 96,
		live: false,
		psize: 'letter',
		pori: 'landscape',
		csize: 'poker',
		cori: 'portrait',
		cheight: '',
		cwidth: '',
		cunit: 'mm',
		gsize: 1,
		gunit: 'mm',
		border: true,
		extCSS: 'https://fonts.googleapis.com/css?family=Raleway|Delius+Swash+Caps&effect=shadow-multiple',
		css: ".wrapper {\n\tdisplay: flex;\n\tflex: 1;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: Raleway, sans-serif;\n\tfont-size: 14pt;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.corner {\n\tdisplay: flex;\n\talign-items: flex-start;\n\tflex-direction: row;\n\tfont-weight: 600;\n\tpadding: 5pt 7pt;\n}\n.reversed {\n\ttransform: rotate(180deg);\}\n.main {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: flex-start;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: 'Delius Swash Caps', sans-serif;\n\tfont-size: 48pt;\n}\n\n",
		csv: 'Number\n2\n3\n4\n5\n6\n7\n8\n9\n10\n13\n16',
		mustache: '<div class="wrapper">\n\t<div class="corner">{{Number}}</div>\n\t<div class="main font-effect-shadow-multiple">\n\t\t<div>{{Number}}</div>\n\t</div>\n\t<div class="corner reversed">{{Number}}</div>\n</div>'
	};

	var cardForm = Bind({
		data: blankForm
	}, {
		data: {
			callback: context.form.change
		},
		'data.name': '#projectName',
		'data.dpi': '#dpi',
		'data.live': '#live',
		'data.psize': 'input[name=psize]',
		'data.pori': 'input[name=pori]',
		'data.csize': '#csize',
		'data.cori': 'input[name=cori]',
		'data.cheight': '#cheight',
		'data.cwidth': '#cwidth',
		'data.cunit': 'input[name=cunit]',
		'data.gsize': '#gsize',
		'data.gunit': 'input[name=gunit]',
		'data.border': '#border',
		'data.extCSS': '#extCSS',
		'data.css': '#css',
		'data.csv': '#csv',
		'data.mustache': '#mustache'
	});

})(hccdo);

window.onload = hccdo.init.start;
