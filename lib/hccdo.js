// hccdo by mcdemarco
// a pure-js, "online" version of hccd

//Todo: better weird card sizes (hex, heart) 
// allow multiple projects in UI and localStorage
// adjust page size for images (drop it) and for large card sizes (increase it)
// test firefox
// Better collapse iconography for hide/show?
// Switch to handlebars?
// Convert docs
// Set up an auto-running webserver (and a "build" process for the docs).
// fix overlay shift on ssbacks.


//init
//form
//project
//size
//style
//util
//write

var hccdo = {};

(function(context) { 

context.init = (function () {

	return {
		start: start
	};

	function activate() {
		//Set up the buttons.
		document.getElementById("addCard").addEventListener('click', hccdo.form.addCard);
		document.getElementById("removeCard").addEventListener('click', hccdo.form.removeCard);
		document.getElementById("clear").addEventListener('click', hccdo.form.clear);
		document.getElementById("projects").addEventListener('click', hccdo.project.change);
		document.getElementById("help").addEventListener('click', hccdo.write.help);
		document.getElementById("hide").addEventListener('click', hccdo.form.toggle);
		document.getElementById("show").addEventListener('click', hccdo.form.toggle);
		document.getElementById("generate").addEventListener('click', hccdo.form.generate);
		document.getElementById("imagine").addEventListener('click', hccdo.form.generate);
		document.getElementById("print").addEventListener('click', hccdo.form.print);
		document.getElementById("view").addEventListener('click', hccdo.write.sizes);
		_.each(document.getElementsByClassName('upload'), function(el) { 
			el.addEventListener('change', hccdo.util.file);
		});
	}

	function fixTab() {
		_.each(document.querySelectorAll("textarea"), function(elt) {
			elt.addEventListener('keydown',function(e) {
				if (e.keyCode === 9) {
					//Get caret
					var start = this.selectionStart;
					var end = this.selectionEnd;
					
					var target = e.target;
					var value = target.value;
					
					//Set textarea to text before caret + tab + text after caret
					var newValue = value.substring(0, start) + "\t" + value.substring(end);
					target.value = newValue;

					//Need to set this manually for bind.js b/c a change isn't fired.
					cardForm.data[elt.id] = newValue;
					
					//Put caret at right position again (add one for the tab)
					this.selectionStart = this.selectionEnd = start + 1;

					//Prevent the unfocus.
					e.preventDefault();
				}
			},false);
		});
	}

	function select() {
		//Populate the selects with sizes.
		var options = _.keys(cardSizes);
		var selElt = document.getElementById("csize");
		populate(selElt,options,true);

		//Paper sizes.
		options = paperSizes;
		selElt = document.getElementById("psize");
		populate(selElt,options,true);

		selElt = document.getElementById("projects");
		var projectNames = context.project.list();
		populate(selElt,projectNames,false,false);

		projectNames = context.project.listExamples();
		populate(selElt,projectNames,false,true);

		_.each(selElt.getElementsByTagName("option"), function(elt) {
			if (elt.value == cardForm.name)
				elt.setAttribute("selected",true);
		});
	}

	function populate(selElt,options,isSize,isExample) {
		_.each(options, function(key) {
			var opt = document.createElement('option');
			var extras = "";
			if (isSize) {
				if (cardSizes[key][1] > 0) {
					extras = " (" + cardSizes[key][1] + cardSizes[key][2] + " x " + cardSizes[key][0] + cardSizes[key][2] + ")";
				}
			} else if (isExample) {
				extras = " (example)";
				opt.setAttribute("data-example","true");
			} else if (_.contains(context.project.listExamples(),key)) {
				//This is an edited example.
				extras = " (custom)";
			} else if (key == "") {
				extras = "(unnamed project)";
			}
			opt.value = key;
			opt.innerHTML = key + extras;
			selElt.appendChild(opt);
		});
	}

	function start() {
		//Set up UI.
		select();
		activate();
		fixTab();

		//Load some data of some sort.
		context.project.stored();

		document.getElementById("projects").value = cardForm.data.name;

		if (_.isEqual(cardForm.data, exampleForm)) {
			//Show the help.
			context.write.help();
		} else {
			//You've been here before!  We'll just show you your data.
			//Not sure about data quality, so wrap the attempt to process the data.
			try {
				context.write.generate(cardForm.data);
			} catch (e) {
				context.write.frame("<html>Card generation failed.</html>");
			}
		}
	}

})();

context.form = (function () {

	return {
		addCard: addCard,
		removeCard: removeCard,
		change: change,
		clear: clear,
		customSize: customSize,
		example: example,
		exampleNames: exampleNames,
		generate: generate,
		toggle: toggle,
		print: print
	};

	function addCard() {
		//Trim.
		cardForm.data.csv = cardForm.data.csv.trim();
		//Get the last line.
		var lastline = cardForm.data.csv.substr(cardForm.data.csv.lastIndexOf("\n")+1);
		//Subtract one from the count for the header.
		var linecount = cardForm.data.csv.split("\n").length - 1;
		var newline = lastline;
		if (lastline.indexOf(linecount) === 0)
			newline = (linecount + 1) + lastline.split(linecount)[1];
		cardForm.data.csv += "\n" + newline;
	};

	function removeCard() {
		//Trim.
		cardForm.data.csv = cardForm.data.csv.trim();
		//Get rid of the last line.
		cardForm.data.csv = cardForm.data.csv.substr(0,cardForm.data.csv.lastIndexOf("\n"));
	};

	function change() {
		//Onchange function called by bind.  Beware the context change.
		context.project.save(this.data);
		if (this.data.live)
			context.write.generate(this.data,false);
		context.form.customSize(this.data);
		//For testing:
		//context.write.frame( JSON.stringify(this.__export(), '', 2) );
		//context.write.frame( JSON.stringify(this.data.csv) );
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
		cardForm.data = examples[0];
		clearFrame();
	}

	function exampleNames() {
		return _.pluck(examples,"name");
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

context.project = (function () {

	//Data storage and retrieval functions.

	return {
		change: change,
//		get: get,
		list: list,
		listExamples: listExamples,
		save: save,
		stored: stored
	};

	function change() {
		//Load a project from the select dropdown.
		var selected = document.getElementById("projects").value;
		var isExample = document.querySelector('#projects option:checked').getAttribute("data-example") == "true";

		if (selected == "blank") {
			cardForm.data = blankForm;
		} else if (isExample) {
			var exampleNames = context.form.exampleNames();
			cardForm.data = examples[exampleNames.indexOf(selected)];
		} else {
			var projNames = list();
			var projArray = get();
			cardForm.data = projArray[projNames.indexOf(selected)];
		}
	}

	function get() {
		//Get the project array from storage.
		var projArray = [];
		if (window.localStorage) {
			try {
				var tempProjArray = JSON.parse(window.localStorage["hccdo"]);
				if (_.isArray(tempProjArray)) {
					projArray = tempProjArray;
				} else if (_.isObject(tempProjArray) && !_.isEmpty(tempProjArray)) {
					//Fix some old data by pushing it.
					projArray.push(tempProjArray);
				}
			} catch(e) {
				console.log("Error checking local storage.");
			}
		}
		return projArray;
	}

	function list() {
		//Return name list of stored projects.
		var projArray = get();
		return _.pluck(projArray,"name");
	}

	function listExamples() {
		//Return name list of example projects.
		return _.pluck(examples,"name");
	}

	function save(data) {
		//Decide if the data really needs saving.
		if (_.isEqual(data, blankForm))
			return;

		// && !_.isEqual(this.data, exampleForm)) 

		var projArray = get();
		var overwriteIndex = _.indexOf(_.pluck(projArray, 'name'), data.name);

		if (overwriteIndex > -1)
			_.chain(projArray).splice(overwriteIndex).push(data);
		else
			projArray.push(data);

		var stringyData = JSON.stringify(projArray);
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
		var projArray = get();
		if (projArray.length) {
			cardForm.data = projArray[projArray.length - 1];
		} else {
			context.form.example();
		}
	}

})();

context.size = (function () {

	return {
		add: add,
		bleed: bleed,
		card: card,
		convert: convert,
		convert2mm: convert2mm,
		double: double,
		grid: grid,
		gutter: gutter,
		orient: orient,
		pad: pad,
		page: page,
		radius: radius,
		safe: safe,
		trim: trim
	};

	//Sizing is returned as [h,w,unit].
	//The code default is portrait, reversed for landscape,
	//though the actual defaults differ for page and card.

	function add(size1,size2) {
		//Addition function handling conversions.
		if (size1[2] != size2[2]) {
			size1 = convert2mm(size1);
			size2 = convert2mm(size2);
		}
		return [size1[0] + size2[0],size1[1] + size2[1],size1[2]];
	}

	function bleed(data) {
		//Get sizing for the bleed.
		var bleedDim = parseFloat(data.blsize);
		return [bleedDim,bleedDim,data.blunit];
	}

	function card(data,addBleed) {
		//Get sizing for the cards.
		var sizeArray;
		if (data.csize == 'custom')
			sizeArray = [parseFloat(data.cheight),parseFloat(data.cwidth),data.cunit];
		else
			sizeArray = cardSizes[data.csize];

		if (addBleed && data.blsize > 0) {
			//Add bleed.
			var bleedSize = bleed(data);
			bleedSize = double(bleedSize,bleedSize);//Need it twice.
			sizeArray = add(sizeArray,bleedSize);
		}

		sizeArray = orient(sizeArray,data.cori);
		return sizeArray;
	}

	function double(size) {
		return add(size,size);
	}

	function gutter(data) {
		//Get sizing for the gutters.
		var marginSize = data.gsize/2;
		return [marginSize,marginSize,data.gunit];
	}

	function grid(data) {
		//Get the number of rows and columns at the current card/page size: [r,c]
		var cardSize = card(data,true); //with bleed
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

	function orient(sizeArray,landtrait) {
		if (landtrait == 'landscape')
			sizeArray = _.chain(sizeArray).slice(0,2).reverse().push(sizeArray[2]).value();
		return sizeArray;
	}

	function pad(data) {
		//Get sizing for the safe zone plus any bleed.
		var safeSize = safe(data);
		var bleedSize = bleed(data);
		return add(safeSize,bleedSize);
	}

	function page(data) {
		//Get sizing for the page.
		var sizeArray = [];
		var pageSize = data.psize;
		if (_.contains(paperSizes,pageSize)) {
			sizeArray = cardSizes[pageSize];
		} else {//default to letter
			sizeArray = [297,210,mms]; //[11,8.5,ins];//[279.4, 215.9,mms]
		}

		sizeArray = orient(sizeArray,data.pori);
		return sizeArray;
	}

	function radius(data,addBleed) {
		//Get sizing for the border radius, because of one special case.
		var sizeArray = [0.25,0.25,ins];
		if (_.contains(roundSizes,data.csize) || (data.csize == "custom" && data.ccircle == true)) {
			var cardSize = card(data,addBleed);
			sizeArray = [cardSize[0]/2,cardSize[1]/2,cardSize[2]];
		}
		return sizeArray;
	}

	function safe(data) {
		//Get sizing for the safety zone.
		var safeDim = parseFloat(data.ssize);
		var safeSize = [safeDim,safeDim,data.sunit];
		return safeSize;
	}

	function trim(size1,size2) {
		//Trim size1 by size2, handling conversions.
		if (size1[2] != size2[2]) {
			size1 = convert2mm(size1);
			size2 = convert2mm(size2);
		}
		size2 = double(size2,size2); //Need it twice.
		size2 = [-size2[0], -size2[1], size2[2]]; //Ersatz subtraction.
		return add(size1,size2);
	}

	function convert(sizingArray) {
		//Convert to the other unit, and trim for the UI (no calcs).
		var newSA = [];
		if (sizingArray[2] != mms) {
			newSA = convert2mm(sizingArray);
			_.each([0,1],function(idx) {
				newSA[idx] = parseFloat(newSA[idx].toFixed(3));
			});
		} else {
			_.each([0,1],function(idx) {
				newSA[idx] = parseFloat((sizingArray[idx] / 25.4).toFixed(3));
			});
			newSA[2] = ins;
		}
		return newSA;
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

context.style = (function () {

	return {
		card: card,
		flatten: flatten,
		page: page
	};

	function card(data) {
		var cardSize = context.size.card(data,true);
		var gutterSize = context.size.gutter(data);
		var paddingSize = context.size.pad(data);
		var bleedSize = context.size.bleed(data);
		var safeSize = context.size.safe(data);
		var brSize = context.size.radius(data,true);
		var style = ".card {\n" +
					"\tmargin: " + flatten(gutterSize,0) + ";\n" +
					"\tborder: " + (data.border && ! data.overlay ? "0.8" : "") + "mm solid black;\n" +
					"\tborder-radius: " + flatten(brSize,0) + ";\n" +
					//(paddingSize[0] > 0 ? "\tpadding: " + flatten(paddingSize,0) + ";\n" : "") +
					"\tbackground-clip: padding-box;\n" +
					"\t" + flatten(cardSize) + "\n" +
					"\tposition: relative;" + //for the overlay
					"}\n";
		//Style the outer margin of the overlay.
		var zeroSize = [0,0,cardSize[2]];
		var outerBorder = "2px dotted gray";
		if (data.border)
			outerBorder = "0.8mm solid black"; //Should be configurable here and above.
			
		style += overlay(cardSize,zeroSize,"",outerBorder,brSize);

		//Style the (inside) bleed margin of the overlay.
		cardSize = context.size.card(data,false); //unbleed.
		brSize = context.size.radius(data,false); //unbleed.
		style += overlay(cardSize,bleedSize,"Bleed","2px solid teal",brSize);

		//Style the safe zone of the overlay.
		cardSize = context.size.trim(cardSize,safeSize); //subtract the safe margin.
		var shiftSize = context.size.double(safeSize,safeSize);  //need this twice
		style += overlay(cardSize,shiftSize,"Safe","2px dashed red",brSize);

		return style;
	}

	function flatten(sizeArray,dim) {
		//Turn a sizeArray into a css statement.
		if (dim == 0 || dim == 1)
			return sizeArray[dim] + sizeArray[2];
		else
			return "height:" + sizeArray[0] + sizeArray[2] + ";width:" + sizeArray[1] + sizeArray[2] + ";";
	}

	function overlay(cardSize,shiftSize,name,borderStyle,radiusSize) {
		var oStyle =  ".hccdOverlay" + name + " {\n" +
					"\tposition: absolute;\n" +
					"\ttop:" + flatten(shiftSize,0) + ";\n" +
					"\tleft:" + flatten(shiftSize,1) + ";\n" +
					"\t" + flatten(cardSize) + "\n" +
					"\tborder: " + borderStyle + ";\n" + 
					"\tborder-radius: " + flatten(radiusSize,0) + ";\n" +
					"}\n";
		return oStyle;
	}

	function page(data) {
		var pageSize = context.size.page(data);
		var style = "* {\n\tbox-sizing: border-box;\n}\nbody {\n\theight:" + pageSize[0] + pageSize[2] + ";\n\twidth:" + pageSize[1] + pageSize[2] + ";\n}\n" +
					".page {\n\tmargin-top: 15mm;\n\tborder: 0;\n\tpage-break-after: always;\n\t" +
					"display:flex;\n\tflex-direction:row;\n\tflex-wrap:wrap;\n\talign-items: center;\n\tjustify-content: center;\n}\n";
		return style;
	}

})();

context.util = (function () {

	//Utility functions.

	return {
		file: file
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

})();

context.write = (function () {

	return {
		frame: frame,
		generate: generate,
		help: help,
		sizes: sizes
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
		fullOutput = '<!DOCTYPE html>\n<html>\n<head>\n\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>\n';
		fullOutput += externalLink;
		//Prepare for image.
		if (forImages) {
			fullOutput += '\t<script type="text/javascript" src="lib/dom-to-image.min.js"></script>\n';
			fullOutput += '\t<script type="text/javascript" src="lib/FileSaver.min.js"></script>\n';
			fullOutput += '\t<script type="text/javascript" src="lib/jszip.min.js"></script>\n';
			fullOutput += '\t<script type="text/javascript" src="lib/hccdoImage.js"></script>\n';
			fullOutput += '\t<script type="text/javascript">var dpi = ' + data.dpi + ';\n var projectName = "' + data.name + '";</script>\n';
			fullOutput += "<style>#hccdoutput {display: block;}</style>\n";
		} else {
			fullOutput += "<style>\n" + context.style.page(data) + "</style>\n";
		}
			fullOutput += "<style>\n" + context.style.card(data) + "</style>\n";
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

	function sizes() {
		var fullOutput = "";
		//Assemble webpage.
		fullOutput = '<!DOCTYPE html>\n<html>\n<head>\n\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>\n<style>\n';
		fullOutput += '* {box-model:border-box;}\n';
		fullOutput += 'body {display:flex;flex-wrap:wrap;}\n';
		fullOutput += 'div {border:2px solid black;border-radius:0.25in;margin:10px;' + 
			'display:flex;flex-direction:column;justify-content:center;align-items:center;}\n';
		fullOutput += 'p {text-align:center;}\n';
		fullOutput += '</style>\n</head>\n<body>\n';
		var cardSizeArray = [];
		_.each(cardSizes, function(value, key) {
			//Reorient if necessary here.
			value = context.size.orient(value, cardForm.data.cori);
			cardSizeArray.push([key, value]);
		});
		var sortedSizes = _.sortBy(cardSizeArray, function(subArray) {
			return context.size.convert2mm(subArray[1])[0];
		});
		_.each(sortedSizes,function(nestyArray) {
			var key = nestyArray[0];
			var value = nestyArray[1];
			if (key != "custom") {
				fullOutput += '<div style="' + context.style.flatten(value) +
					(_.contains(roundSizes, key) ? "border-radius: " + value[0]/2 + value[2] : "") + '">' +
					'<p><b>' + key + '</b><br/><br/>' + 
					value[1] + " x " + value[0] + " " + value[2];
				var valueConv = context.size.convert(value);
				fullOutput += '<br/>' + valueConv[1] + " x " + valueConv[0] + " " + valueConv[2] + '</p></div>';
			}
		});
		fullOutput += "</body>\n</html>\n";
		frame(fullOutput);
	}

	function formatter(data,cards) {
		var templateA = '{{#hccdo}}<div class="card card'; //Card # goes here.
		var templateB = ' {{CardClass}}">\n' + data.mustache + "\n";
		if (data.overlay)
			templateB += '<div class="hccdOverlay"></div><div class="hccdOverlayBleed"></div><div class="hccdOverlaySafe"></div>';
		templateB += "</div>{{/hccdo}}";
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
			formatted += Mustache.to_html(templateA + (c+1) + templateB, {hccdo: cards[c]});
		}
		formatted += '</div></div>\n';
		return formatted;
	}

})();

	var cardForm = Bind({
		data: blankForm
	}, {
		data: {
			callback: context.form.change
		},
		'data.name': '#projectName',
		'data.dpi': '#dpi',
		'data.live': '#live',
		'data.psize': '#psize',
		'data.pori': 'input[name=pori]',
		'data.csize': '#csize',
		'data.cori': 'input[name=cori]',
		'data.cheight': '#cheight',
		'data.cwidth': '#cwidth',
		'data.cunit': 'input[name=cunit]',
		'data.ccircle': '#ccircle',
		'data.gsize': '#gsize',
		'data.gunit': 'input[name=gunit]',
		'data.blsize': '#blsize',
		'data.blunit': 'input[name=blunit]',
		'data.ssize': '#ssize',
		'data.sunit': 'input[name=sunit]',
		'data.border': '#border',
		'data.overlay': '#overlay',
		'data.extCSS': '#extCSS',
		'data.css': '#css',
		'data.csv': '#csv',
		'data.mustache': '#mustache'
	});

})(hccdo);

window.onload = hccdo.init.start;
