// hccdo by mcdemarco
// a pure-js, "online" version of hccd

//Todo: better weird card sizes (hex, heart) 
// adjust page size for images (drop it) and for large card sizes (increase it)
// test firefox
// Better collapse iconography for hide/show?
// Switch to handlebars?
// Convert docs
// Set up an auto-running webserver (and a "build" process for the docs).
// add bleed/safe to card size view (too difficult?)
// Use html 5 element names instead of classes
// Import-export.
// add pixel option to bleed/safe.
// change default DPI to 300.
// rename border "cut line"


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

	function start() {
		//Set up the UI.
		select(); //Should not fire the onchange.
		activate();
		fixTab();

		//Load some data of some sort.
		context.project.stored();

		//Should not fire the onchange. (?)
		document.getElementById("projects").value = cardForm.data.name;

		if (_.isEqual(cardForm.data, exampleForm)) {
			//If we've defaulted to the example, show the help instead of the cards.
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

	//private
	function activate() {
		//Set up the buttons.
		var buttons = {
			addCard: hccdo.form.addCard,
			removeCard: hccdo.form.removeCard,
			clear: hccdo.form.clear,
			help: hccdo.write.help,
			hide: hccdo.form.toggle,
			show: hccdo.form.toggle,
			generate: hccdo.form.generate,
			imagine: hccdo.form.generate,
			print: hccdo.form.print,
			view: hccdo.write.sizes
		};
		_.each(buttons, function(value, key) {
			document.getElementById(key).addEventListener('click',value);
		});

		//Set up the onchanges.
		document.getElementById("projects").addEventListener('change', hccdo.project.change);
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

		// fix for examples
		if (_.isEqual(data, exampleForm))
			return;

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

	function radius(data,bleed) {
		//Get sizing for the border radius; the special case is only for circles
		var brDim = parseFloat(data.bradius);
		var sizeArray = [brDim,brDim,data.brunit];
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

	function trim(size1,cutSize) {
		//Trim size1 by cutSize, handling conversions.
		if (size1[2] != cutSize[2]) {
			size1 = convert2mm(size1);
			cutSize = convert2mm(cutSize);
		}
		var size2 = double(cutSize,cutSize); //Need it twice.
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
		var bleedSize = context.size.bleed(data);
		var safeSize = context.size.safe(data);
		var brSize = context.size.radius(data,true);
		var style = ".card {\n" +
					"\tmargin: " + flatten(gutterSize,0) + ";\n" +
					"\tbackground-color: white;\n" +
					"\tborder-radius: " + flatten(brSize,0) + ";\n" +
					"\tbackground-clip: padding-box;\n" +
					"\t" + flatten(cardSize) + "\n" +
					"\tposition: relative;" + //for the overlays
					"}\n";
		style += bleed(data);
		style += cut(data);
		style += safe(data);



		//Style the outer margin of the overlay.
		var zeroSize = [0,0,cardSize[2]];
		var outerBorder;
		if (data.overlay)
			outerBorder = "2px dotted gray";
		if (data.border)
			outerBorder = "0.8mm solid black"; //Should be configurable?
			
		if (outerBorder) {
			style += overlay(cardSize,zeroSize,"Bleed",outerBorder,brSize);
		}

		//Style the (inside) bleed margin of the overlay.
		cardSize = context.size.card(data,false); //unbleed.
		brSize = context.size.radius(data,false); //unbleed.
		style += overlay(cardSize,bleedSize,"Cut","2px solid teal",brSize);

		//Style the safe zone of the overlay.
		cardSize = context.size.trim(cardSize,safeSize); //subtract the safe margin.
		var shiftSize = context.size.add(bleedSize,safeSize);
		style += overlay(cardSize,shiftSize,"Safe","2px dashed red",brSize);

		return style;
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

	function bleed(data) {
		//Style the bleed div (same outside as the card, padded for bleed).
		var cardSize = context.size.card(data,true);
		var bleedSize = context.size.bleed(data);
		var brSize = context.size.radius(data,true);
		var style = [];
		style.push(".bleed {");
		style.push("border-radius: " + flatten(brSize,0) + ";");
		style.push("padding: " + flatten(bleedSize,0) + ";");
		style.push(flatten(cardSize));
		style.push("}");
		return style.join("\n");
	}

	function cut(data) {
		//Style the cut div (inside the cut line).
		var cardSize = context.size.card(data,false);
		var safeSize = context.size.safe(data);
		var radiusSize = context.size.radius(data);
		var style = [];
		style.push(".cut {");
		style.push("padding: " + flatten(safeSize,1) + ";");
		//style.push("background-color: cornflowerblue;");
		style.push("border-radius: " + flatten(radiusSize,0) + ";");
		style.push(flatten(cardSize));
		style.push("}");
		return style.join("\n");
	};

	function safe(data) {
		//Style the safe div.
		var cardSize = context.size.card(data, false);
		var safeSize = context.size.safe(data);
		var safeZoneSize = context.size.trim(cardSize,safeSize);
		var brSize = context.size.radius(data);
		var style = [];
		style.push(".safe {");
		//style.push("background-color: pink;");
		style.push("border-radius: " + flatten(brSize,0) + ";");
		style.push(flatten(safeZoneSize));
		style.push("}");
		return style.join("\n");
	};

	function flatten(sizeArray,dim) {
		//Turn a sizeArray into a css statement.
		if (dim == 0 || dim == 1)
			return sizeArray[dim] + sizeArray[2];
		else
			return "height:" + sizeArray[0] + sizeArray[2] + ";width:" + sizeArray[1] + sizeArray[2] + ";";
	}

	function page(data) {
		var pageSize = context.size.page(data);
		var style = [];
		style.push("* {box-sizing: border-box;}");
		style.push("body {height:" + pageSize[0] + pageSize[2] + ";width:" + pageSize[1] + pageSize[2] + ";}");
		style.push("body {background-color:#cecece;}");
		style.push("@media print {body {background-color:white;}}");
		style.push(".page {margin-top: 15mm;border: 0;page-break-after: always;");
		style.push("display:flex;flex-direction:row;flex-wrap:wrap;align-items: center;justify-content: center;}");
		return style.join("\n");
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

			//Sanitize projectname.
			var cleanName = data.name.replace(/\W+/g, '');
			if (cleanName.length === 0)
				cleanName = "project";

			fullOutput += '\t<script type="text/javascript">var dpi = ' + data.dpi + ';\n var projectName = "' + cleanName + '";</script>\n';
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
		//The page of card sizes.
		var fullOutput = "";
		//Assemble webpage.
		fullOutput = '<!DOCTYPE html>\n<html>\n<head>\n\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>\n<style>\n';
		fullOutput += '* {box-model:border-box;}\n';
		fullOutput += 'body {display:flex;flex-wrap:wrap;background-color:#cecece;}\n';
		fullOutput += '@media print {body {background-color:white;}}\n';
		fullOutput += 'div {border:2px solid black;border-radius:0.25in;margin:10px;background-color:white;' + 
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
		var templateB = ' {{CardClass}}">\n\t<div class="bleed">\n\t\t<div class="cut">\n\t\t\t<div class="safe">' + data.mustache;
		templateB += "\n\t\t\t</div>\n\t\t</div>\n\t</div>";
		if (data.overlay || data.border)
			templateB += '\n\t<div class="hccdOverlayBleed"></div>';
		if (data.overlay)
			templateB += '<div class="hccdOverlayCut"></div><div class="hccdOverlaySafe"></div>';
		templateB += "\n</div>{{/hccdo}}";
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
		'data.bradius': '#bradius',
		'data.brunit': 'input[name=brunit]',
		'data.overlay': '#overlay',
		'data.extCSS': '#extCSS',
		'data.css': '#css',
		'data.csv': '#csv',
		'data.mustache': '#mustache'
	});

})(hccdo);

window.onload = hccdo.init.start;
