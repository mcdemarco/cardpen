// cardpen by mcdemarco
// a pure-js playing card generator

//TODO: 
// test firefox
// Set up my own cors proxy for bgg?
// add bleed/safe to card size view (too difficult? only selected size?)
// Refactor/make optional the bleed/safe wrappers?
// Handle printing backs like PnPDeliver?
// em dashes not converted for help (smartypants option?) (marked cli can't pass options known issue #110)
// replace +/- card buttons with icons
// General issue scaling google fonts to 300 dpi (system fonts ok, toggle the goog)
// add UI layout options (E m backwards E)?
// Replace erstwhile BGG toggle with verification?

//init
//form
//idk
//project
//size
//style
//util
//write

var cardpen = {};

(function(context) { 

context.init = (function () {

	return {
		start: start
	};

	function start() {
		//Set up the UI.
		select(); //Should not fire the onchange.
		activate();

		//Load some data of some sort.  
		//Generate the cards if stored data is found, else default to example and show help.
		context.project.stored(true);

		//May be safe to activate the codemirrors now.
		_.each(mirrors, function(mirrObj,key) {
			mirrObj.on("change", function() {cardpen.form.changeCode(key);});
		});
	}

	//private
	function activate() {
		//Set up the buttons.
		//Individual buttons.
		var buttons = {
			addCard: cardpen.form.addCard,
			removeCard: cardpen.form.removeCard,
			export: cardpen.util.exporter,
			idkFetch: cardpen.idk.fetch
		};
		_.each(buttons, function(value, key) {
			document.getElementById(key).addEventListener('click',value);
		});

		//Button groups.
		var buttonClasses = {
			load: cardpen.form.load,       //clear, eg, stored.
			format: cardpen.form.generate, //images, html, print
			view: cardpen.form.view	       //cardsView, editorView, settingsView
		};
		_.each(buttonClasses, function(value, key) {
			_.each(document.getElementsByClassName(key), function(el) {
				el.addEventListener('click',value);
			});
		});

		//HTML5 load buttons are weird.
		_.each(document.getElementsByClassName('upload'), function(el) { 
			el.addEventListener('change', cardpen.util.file);
		});

		document.getElementById("exampleList").addEventListener('change', cardpen.util.web);
	}

	function select() {
		//Populate the selects with sizes.
		var options = _.keys(cardSizes);
		var selElt = document.getElementById("csize");
		populate(selElt,options);

		//Paper sizes.
		options = paperSizes;
		selElt = document.getElementById("psize");
		populate(selElt,options);

		//Examples
		options = _.first(exampleFiles,12);
		selElt = document.getElementById("exampleList");
		populate2(selElt,options);
	}

	function populate(selElt,options) {
		_.each(options, function(key) {
			var opt = document.createElement('option');
			var extras = "";
			if (cardSizes[key][1] > 0) {
				extras = " (" + cardSizes[key][1] + cardSizes[key][2] + " x " + cardSizes[key][0] + cardSizes[key][2] + ")";
			}
			opt.value = key;
			opt.innerHTML = key + extras;
			selElt.appendChild(opt);
		});
	}

	function populate2(selElt,options) {
		_.each(options, function(val,idx) {
			var opt = document.createElement('option');
			opt.value = val;
			opt.innerHTML = val;
			selElt.appendChild(opt);
		});
	}

})();

context.form = (function () {

	return {
		addCard: addCard,
		removeCard: removeCard,
		change: change,
		changeCode: changeCode,
		customSize: customSize,
		generate: generate,
		get: get,
		load: load,
		projectToggle: projectToggle,
		refresh: refresh,
		select: select,
		set: set,
		unselect: unselect,
		view: view
	};

	function addCard() {
		//Get the last line.
		if (mirrors.csv.lastLine() < 1)
			return;
		var lastline = mirrors.csv.getLine(mirrors.csv.lastLine()).trim();
		//If the last line is empty, remove it and try again.
		if (lastline == "") {
			removeCard();
			addCard();
			return;
		}
		//Subtract one from the count for the header (to optionally use in new line).
		var linecount = mirrors.csv.lineCount() - 1;
		//Calculate changed line.
		var newline = lastline;
		if (lastline.indexOf(linecount) === 0)
			newline = (linecount + 1) + lastline.split(linecount)[1];
		//Write change.
		mirrors.csv.replaceRange("\n" + newline,{line: Infinity});
		//Save change in the shadow csv (todo: remove).
		cardForm.csv = mirrors.csv.getValue();
	};

	function removeCard() {
		//Too complicated, but there's really no good way to do this in the API.
		var lastline = mirrors.csv.lastLine();
		//The strange range helps to nuke the newline at the end of the previous line.
		mirrors.csv.replaceRange("", {line: lastline - 1}, {line: lastline});
		//Save change in the shadow csv (todo: remove).
		cardForm.csv = mirrors.csv.getValue();
	};

	function change() {
		//Onchange function called by bind.  Beware the context change.
		if (typeof event == "undefined" || !event || !event.currentTarget || event.currentTarget.readyState || (event.currentTarget.classList && event.currentTarget.classList.contains("load"))) {
			//Only save for real user actions because bind, bind, FileReader, load respectively.
		} else {
			context.project.save(this.data);
		}
		if (this.data.live)
			context.write.generate(this.data);
		context.form.customSize(this.data);
		context.write.expectedSize(this.data);
	};

	function changeCode(type) {
		cardForm.data[type] = mirrors[type].getValue();
	};

	function clear() {
		set(blankForm);
		//Also clear iframe.
		context.write.clearFrame();
	}

	function customSize(data) {
		if (data.csize == "custom") {
			document.getElementById("customize").style.display = "inline";
		} else {
			document.getElementById("customize").style.display = "none";
		}
	}

	function generate(e) {
		//A wrapper that translates the event into the appropriate format setting.
		//(See write.massage() for the reasons.)
		var newFormat;
		if (e && e.target) {
			newFormat = e.target.getAttribute("data-format");
			if (e.target.getAttribute("data-view") == "cardsView") {
				//Restores the pre-help output selection.
				newFormat = getSelected("format");
			}
		}
		context.write.generate(get(),newFormat);
		if (newFormat == "print" && !(e.target && e.target.getAttribute("data-view") == "cardsView")) {
			//If restoring, don't try to print again.
			context.util.printFrame();
		}
	}

	function get() {
		//No longer handling all textareas in bind, so need a real getter/setter.
		var data = cardForm.data;
		_.each(mirrors, function(mirrObj,key) {
			data[key] = mirrObj.getValue();
		});
		return data;
	}

	function getSelected(classData) {
		//Figure out the current selected type (for a corner case).
		var elt = document.querySelectorAll("button." + classData + ".selected");
		if (elt.length > 0)
			return elt[0].getAttribute("data-" + classData);
		else
			return "";
	}

	function load(e) {
		//Load an example or other data set from a UI button (no save).
		if (e && e.target) {
			//Remove the old selected class and add the new one.
			unselect("load");
			e.target.classList.add("selected");
			var currentId = e.target.getAttribute("id");
			switch (currentId) {
				case "clear":
				clear();
				break;

				case "eg":
				case "load":
				projectToggle(currentId);
				break;

				case "stored":
				context.project.stored();
				break;
			}
		}
		//Not a live part of the form, so we have to update it manually.
		context.write.expectedSize(cardForm.data);
	}

	function projectToggle(id) {
		//For toggling the load/example forms using some of the project buttons.
		var section = document.getElementById(id + "Subsubsection");
		if (section.style.display == "none") {
			//Hide the other toggle too.
			_.each(document.querySelectorAll(".projectToggle"), function(el) {
				el.style.display = "none";
			});
			section.style.display = "";
		} else {
			section.style.display = "none";
		}

		if (id == "load" && section.style.display == "none")
			document.getElementById("loadForm").reset();
		else if (id == "eg")
			context.util.web();
	}

	function refresh() {
		//Call refresh on all the mirrors when unhiding (the only obvious problem is notes).
		_.each(mirrors, function(mirrObj,key) {
			mirrObj.refresh();
		});
	}

	function select(groupClass,selecteeClass) {
		//View buttons are duplicated.
		_.each(document.querySelectorAll("button." + groupClass + "." + selecteeClass), function(elt) {
			elt.classList.add("selected");
		});
	}

	function unselect(groupClass) {
		//View buttons are duplicated.
		_.each(document.querySelectorAll("button." + groupClass +".selected"), function(elt) {
			elt.classList.remove("selected");
		});
	}

	function set(data) {
		cardForm.data = data;
		_.each(mirrors, function(mirrObj,key) {
			mirrObj.setValue(data[key]);
		});
	}

	function toggle(what) {
		//Internal function For hiding/showing most of the form.
		var hiding = (what == "off");
		var sectionNonArray = document.querySelectorAll("section");
		//The major changes.
		_.each(sectionNonArray, function(el) {
			if (el.id != "buttons")
				el.style.display = (hiding ? "none" : "flex");
		});
		//Set up/take down the special collapsed view.
		_.each(document.getElementsByClassName("show"), function(el) {
				el.style.display = (hiding ? "" : "none");
		});
		if (!hiding) {
			//Handle the settings subcase.
			var settingsSections = document.getElementsByClassName("settings");
			_.each(settingsSections, function(elt) {
				//Now includes special handling for the Mustache span.
				elt.style.display = (what == "on" ? (elt.tagName.toLowerCase() == "span" ? "inline" : "flex") : "none");
			});
			
		}
	}

	function view(e) {
		//Change the layout from a UI button.
		if (e && e.target) {
			//Remove the old selected class and add the new one.
			var oldView = getSelected("view");
			unselect("view");
			var newView = e.target.getAttribute("data-view");
			select("view",newView);

			//Pass to the view changer.
			switch (newView) {

				case "sizes":
				context.write.sizes();
				toggle("off");
				break;

				case "help":
				context.write.help();
				toggle("off");
				break;

				case "cardsView":
				context.form.generate((oldView == "help" ? e : null));
				toggle("off");
				break;

				case "editorView":
				toggle("editor");
				refresh();
				break;

				case "settingsView":
				toggle("on");
				refresh();
				break;

			}
		}
	}

})();

context.idk = (function () {

	return {
		fetch: fetch
	};

	function fetch() {
		var username = document.getElementById("username").value;
		if (!username) {
			return;
		} else {
			store(username);
		}

		//Assemble the API query.  In production, run own proxy.
		//old bgg api
		//var bggURL = "https://boardgamegeek.com/xmlapi/collection/" + username + "?own=1&excludesubtype=boardgameexpansion";
		//filtered version for example data; need stats to get stats here for some reason
		//var bggURL = "https://boardgamegeek.com/xmlapi2/collection?username=" + username + "&own=1&excludesubtype=boardgameexpansion&stats=1&minbggrating=7";
		//new api
		var bggURL = "https://boardgamegeek.com/xmlapi2/collection?username=" + username + "&own=1&excludesubtype=boardgameexpansion&stats=1";

		//Make the request.
		//Need a CORS proxy due to bad configuration of the BGG API. (See docs.)
		var xhr = new XMLHttpRequest();
		xhr.open('GET', corsProxy + bggURL);
		xhr.onload = processor;
		xhr.addEventListener("error", processErrors);
		xhr.send();
	};

	function processErrors(responseXML) {
		if (responseXML.type == "error" || !responseXML.firstElementChild) {
			context.write.frame("No response received from BGG.  Try checking your internet connection.");
			return true;
		} else if (responseXML.firstElementChild.nodeName == "message") {
			context.write.frame(responseXML.firstElementChild.textContent);
			return true;
		} else if (responseXML.firstElementChild.nodeName == "errors") {
			//<errors> has an <error> child.
			context.write.frame(responseXML.firstElementChild.firstElementChild.textContent);
			return true;
		} else {
			//Clear any previous errors.
			context.write.clearFrame();
			return false;
		}
	}
	
	function processor() {
		if (processErrors(this.responseXML))
			return;

		var csvDelimiter = "\t";
		//Fragile.
		var itemArray = this.responseXML.firstChild.children;
		var csvOutput = _.reduce(itemArray, function(acc,val) {
			return acc + "\n" + flatten(val,csvDelimiter);
		}, ["thing","name","year","src","minplayers","maxplayers","players","minplaytime","maxplaytime","playtime","rating","average","bayesaverage","rank"].join(csvDelimiter));
		
		//Should eliminate first line.
		cardForm.data.csv = csvOutput;
		mirrors.csv.setValue(csvOutput);
		return;
	}
	
	function flatten(node,csvDelimiter) {
		//Extract the desired info from the scraped and jsonified html (object).
		//Fragile.
		var flat = [];
		flat.push(node.getAttribute("objectid")); //bgg thing id 
		flat.push(node.querySelector("name").textContent);
		flat.push(node.querySelector("yearpublished") ? node.querySelector("yearpublished").textContent : "");
		flat.push(node.querySelector("image").textContent); //src
		var stats = node.querySelector("stats");
		var minp = stats.getAttribute("minplayers");
		var maxp = stats.getAttribute("maxplayers");
		flat.push(minp);
		flat.push(maxp);
		flat.push(formatRange(minp,maxp)); //range
		var mint = stats.getAttribute("minplaytime");
		var maxt = stats.getAttribute("maxplaytime");
		flat.push(mint);
		flat.push(maxt);
		flat.push(formatRange(mint,maxt)); //range
		var rates = stats.querySelector("rating");
		flat.push(deNA(rates.getAttribute("value")));
		flat.push(round(deNA(rates.querySelector("average").getAttribute("value"))));
		flat.push(round(deNA(rates.querySelector("bayesaverage").getAttribute("value"))));
		var rank = "N/A";
		if (rates.querySelector("ranks"))
			rank = rates.querySelector("ranks").querySelector("rank").getAttribute("value");
		flat.push(deNA(rank));
		return flat.join(csvDelimiter);
	}

	function deNA(thing) {
		return (thing == "N/A" ? "" : thing);
	}

	function formatRange(min, max) {
		if (min == max) 
			return min;
		else
			return min + "&ndash;" + max;
	}

	function round(string) {
		if (string)
			string = parseFloat(string).toFixed(1);
		return string;
	}

	function store(username) {
		if (window.localStorage) {
			try {
				window.localStorage["bggUsername"] = username;
			} catch(e) {
				console.log("Error saving to local storage.");
			}
		}
	}

	function stored() {
		//Retrieve stored username.
		if (window.localStorage) {
			try {
				var username = window.localStorage["bggUsername"];
				if (username)
					document.getElementById("username").value = username;
			} catch(e) {
				console.log("Error checking local storage.");
			}
		}
	}

})();

context.project = (function () {

	//Data storage and retrieval functions.

	return {
		save: save,
		stored: stored
	};

	function save(data) {
		//Decide if the data really needs saving.
		if (_.isEqual(data, blankForm) || _.isEqual(data, exampleForm) || _.isEqual(data, idkForm))
			return;

		var stringyData = JSON.stringify(data);
		if (window.localStorage) {
			try {
				window.localStorage["cardpen"] = stringyData;
				//Also set the selection.
				context.form.unselect("load");
				document.getElementById("stored").classList.add("selected");
			} catch(e) {
				console.log("Error saving to local storage.");
			}
		}
	}

	function stored(defaultToEg) {
		//Populate the form with the data currently in localStorage (flag: or the default data).
		//If it finds stored data, try to generate.  If it defaults, show the help instead.
		var storedProj;
		if (window.localStorage) {
			try {
				var tempProj = JSON.parse(window.localStorage["cardpen"]);
				if (_.isObject(tempProj) && !_.isEmpty(tempProj)) {
					storedProj = tempProj;
				}
			} catch(e) {
				console.log("Error checking local storage.");
			}
		}

		if (storedProj) {
			context.form.set(storedProj);
			document.getElementById("stored").classList.add("selected");
			context.write.tryGenerate();
		} else if (defaultToEg) {
			context.form.set(exampleForm);
			document.getElementById("eg").classList.add("selected");
			context.write.help();
		}
	}

})();

context.size = (function () {

	return {
		add: add,
		bleed: bleed,
		bleedCard: bleedCard,
		card: card,
		convert: convert,
		convert2mm: convert2mm,
		convert2px: convert2px,
		double: double,
		grid: grid,
		gutter: gutter,
		margin: margin,
		orient: orient,
		page: page,
		pixels: pixels,
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
    var bleedSize = [bleedDim,bleedDim,data.blunit];
		return convert2in(bleedSize,data.dpi);
	}

	function bleedCard(pxCardSizing,data) {
		//Get a bled card size for an arbitrary pixel sizing of card.
		var bleedDim = parseFloat(data.blsize,10);
    var bleedSize = [bleedDim,bleedDim,data.blunit];
		bleedSize = convert2px(bleedSize,parseInt(data.dpi,10));
		//Because these are in pixels, they will stay in pixels,
		//but the addition functions are not otherwise pixel-safe.
		return add(pxCardSizing, double(bleedSize));
	}

	function card(data,addBleed) {
		//Get sizing for the selected card size.
		var sizeArray;
		if (data.csize == 'custom') {
			sizeArray = [parseFloat(data.cheight),parseFloat(data.cwidth),data.cunit];
			//This is one of the measurements that might be in pixels.
			sizeArray = convert2in(sizeArray,data.dpi);
		} else {
			sizeArray = cardSizes[data.csize];
		}

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
		var gutterSize = data.gsize/2;
		return [gutterSize,gutterSize,data.gunit];
	}

	function grid(data) {
		//Get the number of rows and columns at the current card/page size: [r,c]
		var cardSize = card(data,true); //with bleed
		var pageSize = page(data);
		var gutterSize = gutter(data);
		var marginSize = margin(data);
		//If everything is not in same units, convert it all to mms.
		if (!(cardSize[2] == pageSize[2] && cardSize[2] == gutterSize[2] && cardSize[2] == marginSize[2])) {
			cardSize = convert2mm(cardSize);
			pageSize = convert2mm(pageSize);
			gutterSize = convert2mm(gutterSize);
			marginSize = convert2mm(marginSize);
		}
		marginSize = double(marginSize);

		//Subtract the margins.
		var rolms = _.map([0,1], function(idx) {
			return Math.floor((pageSize[idx] - marginSize[idx])/(cardSize[idx] + gutterSize[idx]));
		});
		return rolms;
	}

	function margin(data) {
		//Get sizing for the margins.
		var marginSize = data.msize;
		return [marginSize,marginSize,data.munit];
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
		} else {
			//default to letter
			sizeArray = [11,8.5,ins];//[279.4, 215.9,mms]
		}

		sizeArray = orient(sizeArray,data.pori);
		return sizeArray;
	}

	function pixels(data,returnBig) {
		//Calculate a special version of the height and width of the card in pixels,
		//in order to work around a bug in dom-to-image.
		var dpi = parseInt(data.dpi,10);
		var bigPixels = convert2px(card(data,true),dpi);
		if (returnBig)
			return bigPixels;

		var newSA = [];
		_.each([0,1],function(idx) {
			newSA[idx] = bigPixels[idx] * 96 / dpi;
		});

		return newSA;
	}

	function radius(data,addBleed) {
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
		return convert2in(safeSize,data.dpi);
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
		//Convert between mms and inches, and trim for the UI (no calcs).
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

	function convert2in(sizingArray,dpi) {
		//Convert from px to inches (for bleed/safe/custom cases),
		//if it's not already in a standard unit.
		if (sizingArray[2] != pxs)
			return sizingArray;
		else {
			var newSA = [];
			_.each([0,1],function(idx) {
				newSA[idx] = sizingArray[idx] / parseInt(dpi,10);
			});
			newSA[2] = ins;
			return newSA;
		}
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

	function convert2px(sizingArray, dpi) {
		//Convert from inches or mms to pixels and trim for the UI,
		//if it's not already in the correct units.
		if (sizingArray[2] == pxs)
			return sizingArray;

		if (sizingArray[2] == mms)
			sizingArray = convert(sizingArray);

		var newSA = [];
		_.each([0,1],function(idx) {
			newSA[idx] = parseInt(sizingArray[idx] * dpi,10);
		});
		newSA[2] = pxs;
		return newSA;
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
		var opacity = data.oopa;
		var style = "card {\n" +
					"\tdisplay: block;\n" +
					"\tmargin: " + flatten(gutterSize,0) + ";\n" +
					"\tpadding: 0;\n" +
					"\tbackground-color: white;\n" +
					"\tborder-radius: " + flatten(brSize,0) + ";\n" +
					"\tbackground-clip: padding-box;\n" +
					"\t" + flatten(cardSize) + "\n" +
					"\tposition: relative;" + //for the overlays
					"}\n";
		style += bleed(data) + "\n";
		style += cut(data) + "\n";
		style += safe(data) + "\n";

		//Style the outer margin of the overlay.
		var zeroSize = [0,0,cardSize[2]];
		var outerBorder;
		if (data.overlay) 
			outerBorder = "2px dotted gray";
		if (data.cutline)
			outerBorder = "0.8mm solid black"; //Should be configurable?
			
		if (data.oURL) {
			//Style the overlay image only (inserted elsewhere).
			style += overlay(cardSize,zeroSize,"Bleed",0,brSize,opacity);
		} else {
			//Write and style the usual overlay borders.
			if (outerBorder) {
				style += overlay(cardSize,zeroSize,"Bleed",outerBorder,brSize,(data.overlay ? opacity : undefined));
			}

			//Style the (inside) bleed margin of the overlay.
			cardSize = context.size.card(data,false); //unbleed.
			brSize = context.size.radius(data,false); //unbleed.
			style += overlay(cardSize,bleedSize,"Cut","2px solid red",brSize,opacity);
			
			//Style the safe zone of the overlay.
			cardSize = context.size.trim(cardSize,safeSize); //subtract the safe margin.
			var shiftSize = context.size.add(bleedSize,safeSize);
			style += overlay(cardSize,shiftSize,"Safe","2px dashed teal",brSize,opacity);
		}
	
		return style;
	}

	function overlay(cardSize,shiftSize,name,borderStyle,radiusSize,opacity) {
		var oStyle =  "overlay.cardpen" + name + " {\n" +
				"\tposition: absolute;\n" +
				"\ttop:" + flatten(shiftSize,0) + ";\n" +
				"\tleft:" + flatten(shiftSize,1) + ";\n" +
				"\t" + flatten(cardSize) + "\n" +
				"\tborder: " + borderStyle + ";\n" + 
				"\tborder-radius: " + flatten(radiusSize,0) + ";\n" +
				(typeof opacity == "undefined" ? "" : "\topacity: " + opacity + ";\n") +
				"}\n";
		return oStyle;
	}

	function bleed(data) {
		//Style the bleed div (same outside as the card, padded for bleed).
		var cardSize = context.size.card(data,true);
		var bleedSize = context.size.bleed(data);
		var brSize = context.size.radius(data,true);
		var style = [];
		style.push("bleed {");
		style.push("display: block;");
		style.push("margin: 0;");
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
		style.push("cut {");
		style.push("display: block;");
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
		style.push("safe {");
		style.push("display: block;");
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

	function page(data,forImages) {
		var style = [];
		var rolms = context.size.grid(data);
		var marginSize = context.size.margin(data);
		style.push("* {box-sizing: border-box;}");
		style.push("body {margin:0;");
		if (!forImages && rolms[0] > 0 && rolms[1] > 0) {
			//Only restrict the page size when it's harmless to do so.
			var pageSize = context.size.page(data);
			style.push("height:" + pageSize[0] + pageSize[2] + ";width:" + pageSize[1] + pageSize[2] + ";");
		}
		style.push("background-color:#cecece;}");
		style.push("@media print {body {background-color:white;}}");
		style.push("page {margin: " + marginSize[0] + marginSize[2] + ";");
		style.push("border: 0;page-break-after: always;");
		style.push("display:flex;flex-direction:row;flex-wrap:wrap;align-items: center;justify-content: center;}");
		return style.join("\n");
	}

})();

context.util = (function () {

	//Utility functions.

	return {
		exporter: exporter,
		file: file,
		printFrame: printFrame,
		sanitize: sanitize,
		web: web,
		webCallback: webCallback
	};

	function exporter(e) {
		var data = context.form.get();
		var sanitizedName = sanitize(data.name);
		var projectText = JSON.stringify(data,null,2);
		var blob = new Blob([projectText], {type: "application/json"});
		saveAs(blob, sanitizedName + ".json");
	}

	function file(e) {
		//Upload the css, csv, mustache, or export files using html5. 
		var uploader = e.target;
		var fileToLoad = uploader.files[0];
		var reader = new FileReader();
			
		reader.onload = function(e) {
			var type = uploader.getAttribute("data-type");
			if (type == "import") {
				//Will eventually need version control.
				context.form.set(JSON.parse(reader.result));
				context.form.projectToggle("load");
			} else {
				//Should eliminate first row?
				cardForm.data[type] = reader.result;
				mirrors[type].setValue(reader.result);
				context.project.save(context.form.get());
			}
			context.write.generate(context.form.get());
		};
		reader.onerror = function(e) {
			context.write.frame("<html>Unable to generate cards.</html>");
		};
		reader.readAsText(fileToLoad);
	}

	function printFrame() {
		//Print iframe.
		var ifrm = document.getElementById("cpOutput");
		ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
		ifrm.print();
	}

	function sanitize(fileName) {
		var cleanName = fileName.replace(/\W+/g, '');
		if (cleanName.length === 0)
				cleanName = "project" + Date.now().getUnixTime();
		return cleanName;
	}

	function web() {
		//Load an example file from the web by its title.
		var slug = document.getElementById("exampleList").value;
		var fileToLoad = "/examples/" + sanitize(slug) + ".json";

		//xhr for loading the json examples.
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', fileToLoad, true);
    xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == "200") {
				context.util.webCallback(xhr.responseText);
      } else {
				context.write.frame("<html>Unable to load example.</html>");
			}
    };
    xhr.send(null);
 }

	function webCallback(responseText) {
		context.form.set(JSON.parse(responseText));
		context.form.generate();
	}

})();

context.write = (function () {

	return {
		clearFrame: clearFrame,
		expectedSize: expectedSize,
		frame: frame,
		generate: generate,
		help: help,
		massage: massage,
		sizes: sizes,
		tryGenerate: tryGenerate
	};

	function clearFrame() {
		//Clear iframe.
		frame("");
	}

	function expectedSize(data) {
		var sizeArray = context.size.pixels(data,true);
		var sizeString = sizeArray[1] + " x " + sizeArray[0] + "px";
		document.getElementById("expectedSize").innerHTML = sizeString;
	}

	function frame(doc) {
		var ifrm = document.getElementById("cpOutput");
		ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
		ifrm.document.open();
		ifrm.document.write(doc);
		ifrm.document.close();
	}

	function generate(realData,format) {
		var cards, cardsParsed, cardsTemp;
		var externalLink = "";
		var templateOutput = "";
		var fullOutput = "";
		var forImages = (format == "image");
		
		//Set format in UI.
		context.form.unselect("format");
		switch (format) {
			case "print":
			context.form.select("format","print");
			break;
			case "image":
			context.form.select("format","image");
			break;
			default:
			context.form.select("format","html");
			break;
		}

		//Massage the data.
		var data = massage(realData,format);

		//Parse csv.
		cardsTemp = Papa.parse(data.csv, {
			header: true,
			skipEmptyLines: true
		});

		//Massage the csv.
		if (data.rscount && parseInt(data.rscount) > 1) {
			cardsParsed = restructure(parseInt(data.rscount), data.rsstyle, cardsTemp).data;
		} else {
			cardsParsed = cardsTemp.data;
		}

		//Handle the noop case automatically, so the user doesn't have to fill it in.
		if (cardsParsed.length == 0)
			cardsParsed = [{noop: 1}];
			
		//Summon the goog.
		if (data.extCSS)
			externalLink = '\t<link href="' + data.extCSS +'" rel="stylesheet">';

		//Alter cardset to include image tags for mustache.
		cards = _.map(cardsParsed, function(val, idx) {
			val.cardImage = (forImages ? true : false);
			//don't really need this b/c mustache has negation
			//val.cardHTML = (forImages ? false : true);
			return val;
		});

		//Apply template.
		templateOutput = formatter(data,cards,forImages);

		//Assemble webpage.
		fullOutput = '<!DOCTYPE html>\n<html>\n<head>\n\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>\n';
		fullOutput += externalLink;
		//Prepare for image.
		if (forImages) {
			fullOutput += '\t<script type="text/javascript" src="lib/dom-to-image.min.js"></script>\n';
			fullOutput += '\t<script type="text/javascript" src="lib/FileSaver.min.js"></script>\n';
			fullOutput += '\t<script type="text/javascript" src="lib/jszip.min.js"></script>\n';
			fullOutput += '\t<script type="text/javascript" src="js/frame.js"></script>\n';

			//Sanitize projectname.
			var cleanName = context.util.sanitize(data.name);
			var dims = context.size.pixels(data);

			fullOutput += '\t<script type="text/javascript">var dpi = ' + data.dpi + ';\n ' + 
				'var height = ' + dims[0] + ';\n' +
				'var width = ' + dims[1] + ';\n' +
				'var projectName = "' + cleanName + '";' + 
				'</script>\n';
			fullOutput += "<style>#cpOutput {display: block;}\n";
			fullOutput += "#cpError {padding:5px;color:red;}</style>\n";
		} else {
			fullOutput += "<style>\n" + context.style.page(data,forImages) + "</style>\n";
		}
			fullOutput += "<style>\n" + context.style.card(data) + "</style>\n";
		fullOutput += "<style>\n" + data.css + "</style>\n</head>\n<body>\n";
		if (forImages) {
			fullOutput += "<div id='cpError'></div>\n";
			fullOutput += "<button type='button' onclick='zipper();'>Zip Images</button>\n";
			fullOutput += "<div id='cpImages'></div>\n";
		}
		fullOutput += templateOutput + "\n</body>\n</html>\n";

		//Write to frame.
		context.write.frame(fullOutput);
	}

	function help() {
		//Show the help.
		document.getElementById("cpOutput").src = "doc/index.html";
		//Stopped unselecting other outputs so we can restore the previous one.
	}

	function massage(data,format) {
		//Return the data slightly massaged for the output format.
		var massageData = _.clone(data);
		//For print and images, need to turn off overlays.
		if (format == "image" || format == "print")
			massageData.overlay = false;
		//For images, need to turn off gutters (FF bug), borders, and page sizing.
		if (format == "image") {
			massageData.gsize = 0;
			massageData.cutline = false;
		}
		return massageData;
	};

	function restructure(count, style, cardStructure) {
		var cards = cardStructure.data;
		var newCards = [];
		switch (style) {
			case "random":
			cards = _.shuffle(cards);
			//Fall through to buncher (after some unnecessary cycling).

			case "cycle":
			//Check for excess cards that won't fit the permutation.
			var remainder = cards.length % count;
			//Need to how many full rowsets we'll end up with.
			var rowsetCount = Math.floor(cards.length / count);
			var leftover = _.last(cards, remainder);
			//Reorder the array as cycled (by sorting on the index mod the rowset size).
			cards = _.chain(_.initial(cards,remainder)).sortBy(function(elt, idx) {return idx % rowsetCount;}).concat(leftover).value();
			//Fall through to buncher.

			case "bunch":
			//Reverse the array because we're popping it now.
			cards.reverse();
			//Lodash has a chunker that could do this, but _ doesn't.
			while (cards.length > 0) {
				var temp = [];
				for (var co = 0; co < count; co++) {
					var popped = cards.pop();
					if (popped)
						temp.push(popped);
				}
				newCards.push({rowset: temp});
			}
			break;

			default:
			//This case should not occur.
			newCards = cards;
			break;
		}

		cardStructure.data = newCards;
		return cardStructure;
	};

	function sizes() {
		//The page of card sizes.
		var fullOutput = "";
		var data = context.form.get();
		var dpi = parseInt(data.dpi,10);
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
			value = context.size.orient(value, data.cori);
			cardSizeArray.push([key, value]);
		});
		var sortedSizes = _(cardSizeArray).chain().sortBy(function(subArray) {
			return context.size.convert2mm(subArray[1])[1];
		}).sortBy(function(subArray) {
			return context.size.convert2mm(subArray[1])[0];
		}).value();
		_.each(sortedSizes,function(nestyArray) {
			var key = nestyArray[0];
			var value = nestyArray[1];
			if (key != "custom") {
				fullOutput += '<div style="' + context.style.flatten(value) +
					(_.contains(roundSizes, key) ? "border-radius: " + value[0]/2 + value[2] : "") + '">' +
					'<p><b>' + key + '</b><br/><br/>' + formatSize(value);
				var valueConv = context.size.convert(value);
				fullOutput += '<br/>' + formatSize(valueConv) + '</p>';
				fullOutput += '<p style="font-size:smaller;">';
				if (dpi) {
					var valuePx = context.size.convert2px(value, dpi);
					fullOutput += formatSize(valuePx, dpi) + '<br/>(';
					fullOutput += formatSize(context.size.bleedCard(valuePx,data)) + ' with bleed)</p>';
				}
				fullOutput += '</div>';
			}
		});
		fullOutput += "</body>\n</html>\n";
		frame(fullOutput);
	}

	function formatSize(sizeArray, dpi) {
		//Turns a sizeArray [h,w,units] into the text w x h units
		var formattedSize = sizeArray[1] + " x " + sizeArray[0] + " " + sizeArray[2];
		if (dpi)
			formattedSize += " at " + dpi + " DPI";
		return formattedSize;
	}

	function formatter(data,cards,forImages) {
		var templateA = '{{#cardpen}}<card class="' + (forImages ? 'cardImage' : 'cardHTML');
		templateA +=	(data.cardClass ? ' {{' + data.cardClass + '}}' : '') + ' card'; //Card # goes here
		var templateB = '">\n\t<bleed>\n\t\t<cut>\n\t\t\t<safe>';
		templateB += data.mustache + "\n\t\t\t</safe>\n\t\t</cut>\n\t</bleed>";
		if (!forImages && (data.overlay || data.cutline)) {
			templateB += '\n\t<overlay class="cardpenBleed">'; 
			templateB += (data.oURL ? "<img style='height:100%;' src='" + data.oURL + "'/>" : "");
			templateB += '</overlay>';
		}
		if (!forImages && (data.overlay && !data.oURL))
			templateB += '<overlay class="cardpenCut"></overlay><overlay class="cardpenSafe"></overlay>';
		templateB += "\n</card>{{/cardpen}}";
		var rolms = context.size.grid(data);
		var rows = rolms[0];
		var cols = rolms[1];
		var formatted = '';
		for (var c = 0; c < cards.length; c++) {
			if (c % (rows * cols) == 0) {
				if (c > 0) {
					formatted += '\n</page>\n';
				}
				formatted += '<page>\n';
			}
			if (data.useMustache)
				formatted += Mustache.to_html(templateA + (c+1) + templateB, {cardpen: cards[c]});
			else
				formatted += Handlebars.compile(templateA + (c+1) + templateB)({cardpen: cards[c]});
		}
		formatted += '</page></page>\n';
		return formatted;
	}

	function tryGenerate() {
		//A wrapper for generation from the cardForm when it might fail.
		//Note that it can look like a transporter accident without actually triggering an error.
		try {
			context.write.generate(context.form.get());
		} catch (e) {
			context.write.frame("<html>Card generation failed.</html>");
		}
	}

})();

	var cardForm = Bind({
		data: blankForm
	}, {
		data: {
			callback: context.form.change
		},
		'data.name': '#projectName',
		'data.notes': '#notes',
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
		'data.msize': '#msize',
		'data.munit': 'input[name=munit]',
		'data.blsize': '#blsize',
		'data.blunit': 'input[name=blunit]',
		'data.ssize': '#ssize',
		'data.sunit': 'input[name=sunit]',
		'data.cutline': '#cutline',
		'data.bradius': '#bradius',
		'data.brunit': 'input[name=brunit]',
		'data.overlay': '#overlay',
		'data.oURL': '#oURL',
		'data.oopa': '#oopa',
		'data.extCSS': '#extCSS',
		'data.css': '#css',
		'data.csv': '#csv',
		'data.mustache': '#mustache',
		'data.useMustache': '#useMustache',
		'data.cardClass': '#cardClass',
		'data.rscount': '#rscount',
		'data.rsstyle': 'input[name=rsstyle]'
	});

})(cardpen);

window.onload = cardpen.init.start;
