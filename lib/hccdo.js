// hccdo by mcdemarco
// a pure-js, "online" version of hccd

//Todo: bleed
//      weird card sizes (including 3" round)
// allow multiple projects in UI and localStorage

//init
//form
//load
//size
//write

var hccdo = {};

(function(context) { 

	var ins = "in";
	var mms = "mm";
	var cardSizes = {poker: [3.5,2.5,ins],
									 pokerTraditional: [3.5,2.5,ins], //[88.9,63.5] traditional
									 pokerStandard: [88,63,mms],
									 bridge: [3.5,2.25,ins],//88,56
									 mini: [2.5,1.75,ins],
									 miniEuro: [67,44,mms],
									 tarot: [4.75,2.75,ins],
									 large: [5.75,3.5,ins],
									 micro: [1.75,1.25,ins],
									 domino: [3.5,1.75,ins],
									 smallSquare: [2,2,ins],
									 square: [3.5,3.5,ins],
									 trump: [100,62,mms] //[3.95,2.45];};
									 //To do:
									 //3.5in circle
									 //3.75in hex
									};

context.init = (function () {

	return {
		start: start
	};

	function activate() {
		//Set up the buttons.
		document.getElementById("clear").addEventListener('click', hccdo.form.clear);
		document.getElementById("eg").addEventListener('click', hccdo.form.example);
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
			opt.innerHTML = size;
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

		//Not sure about data quality, so wrap the attempt to process the data.
		try {
			context.write.generate();
		} catch (e) {
			alert("Card generation failed.");
		}
	}

})();

context.form = (function () {

	return {
		change: change,
		clear: clear,
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
			context.write.generate(false);
		//For testing:
		//context.write.frame( JSON.stringify(this.__export(), '', 2) );
		//context.write.frame( JSON.stringify(this.data.border) );
	};

	function clear() {
		cardForm.data = blankForm;
		//Also clear iframe.
		clearFrame();
	}

	function example() {
		cardForm.data = exampleForm;
		clearFrame();
	}

	function generate(e) {
		//A wrapper that translates the event into the appropriate image setting.
		var forImage = (e && e.target && e.target.getAttribute("id") == "imagine");
		context.write.generate(forImage);
	}

	function toggle(e) {
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
			context.write.generate(false);
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
		page: page
	};

	//Sizing is returned as [h,w,unit].
	//The code default is portrait, reversed for landscape,
	//though the actual defaults differ for page and card.

	function card() {
		//Get sizing for the cards.
		var sizeArray = cardSizes[cardForm.data.csize];

		if (cardForm.data.cori == 'landscape')
			sizeArray = _.chain(sizeArray).slice(0,2).reverse().push(sizeArray[2]).value();
		return sizeArray;
	}

	function gutter() {
		//Get sizing for the gutters.
		var marginSize = cardForm.data.gsize/2;
		return [marginSize,marginSize,cardForm.data.gunit];
	}

	function page() {
		//Get sizing for the page.
		var sizeArray = [];
		var pageSize = cardForm.data.psize;
		if (pageSize == "letter") {
			sizeArray = [11,8.5,ins];//[279.4, 215.9,mms]
		} else {//a4
			sizeArray = [297,210,mms]; //[11.69,8.27,ins]
		}

		if (cardForm.data.pori == 'landscape') {
			sizeArray = _.chain(sizeArray).slice(0,2).reverse().push(sizeArray[2]).value();
		}
		return sizeArray;
	}

	function grid() {
		//Get the number of rows and columns at the current card/page size: [r,c]
		var cardSize = card();
		var pageSize = page();
		var gutterSize = gutter();
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
		generate: generate
	};

	function frame(doc) {
		var ifrm = document.getElementById("hccdoOutput");
		ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
		ifrm.document.open();
		ifrm.document.write(doc);
		ifrm.document.close();
	}

	function generate(forImages) {
		var cards;
		var externalLink = "";
		var templateOutput = "";
		var fullOutput = "";

		//Parse csv.
		cards = Papa.parse(cardForm.data.csv, {
			header: true,
			skipEmptyLines: true
		});

		//Summon the goog.
		if (cardForm.data.extCSS)
			externalLink = '\t<link href="' + cardForm.data.extCSS +'" rel="stylesheet">';

		//Apply template.
		templateOutput = formatter(cards.data,cardForm.data.mustache);

		//Assemble webpage.
		fullOutput = '<!DOCTYPE html>\n<html>\n<head>\n\t    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>\n';
		fullOutput += externalLink;
		//Prepare for image.
		if (forImages) {
			fullOutput += '    <script type="text/javascript" src="lib/dom-to-image.min.js"></script>\n';
			fullOutput += '    <script type="text/javascript" src="lib/FileSaver.min.js"></script>\n';
			fullOutput += '    <script type="text/javascript" src="lib/jszip.min.js"></script>\n';
			fullOutput += '    <script type="text/javascript" src="lib/hccdoImage.js"></script>\n';
			fullOutput += '    <script type="text/javascript">var dpi = ' + cardForm.data.dpi + ';\n var projectName = "' + cardForm.data.name + '";</script>\n';
			fullOutput += "<style>#hccdoutput {display: block;}</style>\n";
		} else {
			fullOutput += "<style>\n" + pageStyle() + "</style>\n";
		}
			fullOutput += "<style>\n" + cardStyle() + "</style>\n";
		fullOutput += "<style>\n" + cardForm.data.css + "</style>\n</head>\n<body>\n";
		if (forImages) {
			fullOutput += "<button type='button' onclick='zipper();'>Zip Images</button>\n";
			fullOutput += "<div id='hccdoImages'></div>\n";
		}
		fullOutput += templateOutput + "\n</body>\n</html>\n";

		//Write to frame.
		context.write.frame(fullOutput);
	}

	function cardStyle() {
		var cardSize = context.size.card();
		var gutterSize = context.size.gutter();
		var border = cardForm.data.border; //Boolean
		var style = ".card {\n" +
					"    margin: " + gutterSize[0] + gutterSize[2] + ";\n" +
					"    border: 0" + (border ? ".8" : "") + "mm solid black;\n" +
					"    border-radius: 3mm;\n" +
					"    background-clip: padding-box;\n" +
					"    height: " + cardSize[0] + cardSize[2] + ";\n" +
					"    width: " + cardSize[1] + cardSize[2] + ";\n" +
					"}\n";
		return style;
	}

	function pageStyle() {
		var pageSize = context.size.page();
		var style = "body {\n\theight:" + pageSize[0] + pageSize[2] + ";\n\twidth:" + pageSize[1] + pageSize[2] + ";\n}\n" +
					".page {\n\tmargin-top: 15mm;\n\tborder: 0;\n\tpage-break-after: always;\n\t" +
					"display:flex;\n\tflex-direction:row;\n\tflex-wrap:wrap;\n\talign-items: center;\n\tjustify-content: center;\n}\n";
		return style;
	}

	function formatter(cards,template) {
		template = '{{#hccdo}}<div class="card">\n' + template + "\n</div>{{/hccdo}}";
		var rolms = context.size.grid();
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
		csize: 'poker',
		gsize: 0,
		gunit: 'mm',
		pori: 'landscape',
		cori: 'portrait',
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
		csize: 'poker',
		gsize: 1,
		gunit: 'mm',
		pori: 'landscape',
		cori: 'portrait',
		border: true,
		extCSS: 'https://fonts.googleapis.com/css?family=Raleway|Delius+Swash+Caps&effect=shadow-multiple',
		css: ".wrapper {\n\tdisplay: flex;\n\tflex: 1;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: Raleway, sans-serif;\n\tfont-size: 14pt;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.corner {\n\tdisplay: flex;\n\tflex: 2;\n\talign-items: flex-start;\n\tflex-direction: row;\n\tfont-weight: 600;\n\tpadding: 5pt 7pt;\n}\n.reversed {\n\ttransform: rotate(180deg);\}\n.main {\n\tdisplay: flex;\n\tflex: 4;\n\talign-items: center;\n\tjustify-content: flex-start;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\tfont-family: 'Delius Swash Caps', sans-serif;\n\tfont-size: 48pt;\n}\n\n",
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
		'data.csize': '#csize',
		'data.gsize': '#gsize',
		'data.guint': 'input[name=gunit]',
		'data.pori': 'input[name=pori]',
		'data.cori': 'input[name=cori]',
		'data.border': '#border',
		'data.extCSS': '#extCSS',
		'data.css': '#css',
		'data.csv': '#csv',
		'data.mustache': '#mustache'
	});

})(hccdo);

window.onload = hccdo.init.start;
