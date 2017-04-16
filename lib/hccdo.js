// hccdo by mcdemarco
// a pure-js, "online" version of hccd

//Todo: bleed
//      card size (including 3" round)
// allow multiple projects in UI and localStorage

//init
//form
//load
//size
//write

var hccdo = {};

(function(context) { 

context.init = (function () {

	return {
		activate: activate,
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

	function start() {
		//Set up UI.
		activate();

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
		//For testing:
		//context.write.frame( JSON.stringify(this.__export(), '', 2) );
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
			cardForm.data[uploader.parentNode.querySelector("textarea").id] = reader.result;
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
		page: page
	};

	//Sizing is returned as [h,w] in mm.
	//The code default is portrait, reversed for landscape,
	//though the actual defaults differ for page and card.

	function card() {
		//Get sizing for the cards.
		var sizeArray = [];
		sizeArray = [88,63];//poker
		if (cardForm.data.cori == 'landscape')
			sizeArray.reverse();
		return sizeArray;
	}

	function page() {
		//Get sizing for the page.
		var sizeArray = [];
		var pageSize = cardForm.data.paper;
		if (pageSize == "letter") {
			sizeArray = [279.4, 215.9]; //mm
		} else {
			sizeArray = [297, 210]; //mm
		}
		if (cardForm.data.pori == 'landscape')
			sizeArray.reverse();
		return sizeArray;
	}

	function grid() {
		//Get the number of rows and columns at the current card/page size: [r,c]
		var cardSize = card();
		var pageSize = page();
		var gutterSize = 1;  //This should be adjustable.
		var rolms = _.map([0,1], function(idx) { return Math.floor(pageSize[idx]/(cardSize[idx] + gutterSize));});
		return rolms;
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
		var style = ".card {" +
					"    margin: 0.5mm; /* remove this to remove gutters between cards  */" +
					"    border: 0.8mm solid black;" +
					"    border-radius: 3mm;" +
					"    height: " + cardSize[0] + "mm; /* 88.9mm = 3.5 in */" +
					"    width: " + cardSize[1] + "mm;  /* 63.5mm is poker; bridge would be 56mm (2.5 in vs 2.25 in) */" +
					"}";
		return style;
	}

	function pageStyle() {
		var pageSize = context.size.page();
		var style = "body {height:" + pageSize[0] + "mm; width:" + pageSize[1] + "mm;}\n" +
					".page {margin-top: 15mm;border: 0mm;page-break-after: always;" +
					"    display:flex;flex-direction:row;flex-wrap:wrap;align-items: center;justify-content: center;}";
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
			paper: 'letter',
			pori: 'landscape',
			cori: 'portrait',
			extCSS: '',
			css: '',
			csv: '',
			mustache: ''
	};

	var exampleForm = {
			name: 'example',
			dpi: 96,
			paper: 'letter',
			pori: 'landscape',
			cori: 'portrait',
			extCSS: 'https://fonts.googleapis.com/css?family=Raleway|Cherry+Swash&effect=shadow-multiple',
			css: ".wrapper {\n    display: flex;\n    flex: 1;\n    flex-direction: column;\n    justify-content: space-between;\n    font-family: Raleway, sans-serif;\n    font-size: 14pt;\n    width: 100%;\n    height: 100%;\n}\n\n.corner {\n    display: flex;\n    flex: 2;\n    align-items: flex-start;\n    flex-direction: row;\n    font-weight: 600;\n    padding: 10pt;\n}\n.main {\n    display: flex;\n    flex: 4;\n    align-items: center;\n    justify-content: flex-start;\n    flex-direction: column;\n    justify-content: space-between;\n    font-family: 'Cherry Swash', sans-serif;\n    font-size: 48pt;\n}\n\n",
			csv: 'Number\n2\n3\n4\n5\n6\n7\n8\n9\n10\n13\n16',
			mustache: '<div class="wrapper">\n\t<div class="corner">{{Number}}</div>\n\t<div class="main font-effect-shadow-multiple">\n\t\t<div>{{Number}}</div>\n\t</div>\n</div>'
	};

	var cardForm = Bind({
		data: blankForm
	}, {
		data: {
			callback: context.form.change
		},
		'data.name': '#projectName',
		'data.dpi': '#dpi',
		'data.paper': 'input[name=paper]',
		'data.pori': 'input[name=pori]',
		'data.cori': 'input[name=cori]',
		'data.extCSS': '#extCSS',
		'data.css': '#css',
		'data.csv': '#csv',
		'data.mustache': '#mustache'
	});

})(hccdo);

window.onload = hccdo.init.start;
