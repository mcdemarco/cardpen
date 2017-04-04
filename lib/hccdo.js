// hccdo by mcdemarco
// a pure-js ("online") version of hccd

//Todo: store the csv.
//      make rows/cols configurable

//init
//form
//load
//write

var hccdo = {};

(function(context) { 

context.init = (function () {

	return {
		activate: activate,
		generate: generate,
		start: start
	};

	function activate() {
		//Set up the buttons.
		document.getElementById("clear").addEventListener('click', hccdo.form.clear);
		document.getElementById("generate").addEventListener('click', hccdo.init.generate);
		document.getElementById("imagine").addEventListener('click', hccdo.init.generate);
		var uploadNonArray = document.getElementsByClassName('upload');
		Array.prototype.forEach.call(uploadNonArray, function(el, i) { 
			el.addEventListener('change', hccdo.load.file);
		});
	}

	function generate(e) {
		var forImage = (e && e.target && e.target.getAttribute("id") == "imagine");

		//Grab the latest data.
		var data = context.form.getData();
		//Process it.
		context.write.generate(data,forImage);
	}

	function start() {
		//Set up UI.
		activate();

		//Load some data of some sort.
		var data = context.load.getData();
		context.form.populate(data);

		//Not sure about data quality, so wrap the attempt to process the data.
		try {
			context.write.generate(data);
		} catch (e) {
			alert("Card generation failed.");
		}
	}

})();

context.form = (function () {

	return {
		clear: clear,
		get: get,
		getData: getData,
		populate: populate
	};
	
	function clear() {
		var formies = document.querySelectorAll(".hccdoForm");
		Array.prototype.forEach.call(formies, function(el, i) { 
			el.value = "";
		});
		document.getElementById("dpi").value = 96;
		//Also clear iframe.
	}

	function get(elt) {
		//Get a form element value.
		return document.getElementById(elt).value;
	}

	function getData() {
		//Retrieve the data currently in the form.
		var data = {};
		data.name = document.getElementById("hccdoProjectName").value;
		data.extCSS = document.getElementById("extCSS").value;
		data.css = document.getElementById("cssTextarea").value;
		data.csv = document.getElementById("csvTextarea").value;
		data.mustache = document.getElementById("mustacheTextarea").value;
		return data;
	}

	function populate(data) {
		//Populate the form with arbitrary data.
		document.getElementById("hccdoProjectName").value = data.name;
		document.getElementById("extCSS").value = data.extCSS;
		document.getElementById("cssTextarea").value = data.css;
		document.getElementById("csvTextarea").value = data.csv;
		document.getElementById("mustacheTextarea").value = data.mustache;
	}

})();

context.load = (function () {

	//Data loading and storage functions.

	return {
		file: file,
		getData: getData
	};

	function getData() {
		//Retrieve the data currently in localStorage, or the default data.
		var data = {};
		if (window.localStorage && window.localStorage["hccdo"])
			data = getDataFromStorage();

		if (Object.keys(data).length === 0) 
			data = getDefaultData();

		return data;
	}

	function getDataFromStorage() {
		var data;
		try {
			data = JSON.parse(window.localStorage["hccdo"]);
		} catch (e) {
			data = {};
		}
		return data;
	}

	function getDefaultData() {
		//Return the example data.
		var data = {};
		data.name = 'example';
		data.css = ".wrapper {\n    display: flex;\n    flex: 1;\n    flex-direction: column;\n    justify-content: space-between;\n    font-family: Raleway, sans-serif;\n    font-size: 14pt;\n    width: 100%;\n    height: 100%;\n}\n\n.corner {\n    display: flex;\n    flex: 2;\n    align-items: flex-start;\n    flex-direction: row;\n    font-weight: 600;\n    padding: 10pt;\n}\n.main {\n    display: flex;\n    flex: 4;\n    align-items: center;\n    justify-content: flex-start;\n    flex-direction: column;\n    justify-content: space-between;\n    font-family: 'Cherry Swash', sans-serif;\n    font-size: 48pt;\n}\n\n";
		data.csv = 'Number\n2\n3\n4\n5\n6\n7\n8\n9\n10\n13\n16';
		data.mustache = '<div class="wrapper">\n\t<div class="corner">{{Number}}</div>\n\t<div class="main font-effect-shadow-multiple">\n\t\t<div>{{Number}}</div>\n\t</div>\n</div>';
		data.extCSS = 'https://fonts.googleapis.com/css?family=Raleway|Cherry+Swash&effect=shadow-multiple';
		return data;
	}

	function file(e) {
		var uploader = e.target;
		//Load a css or csv file using html5.
		var fileToLoad = uploader.files[0];
		var reader = new FileReader();
			
		reader.onload = function(e) {
			uploader.parentNode.querySelector("textarea").value = reader.result;
			context.init.generate();
			save();
		};
		reader.onerror = function(e) {
			context.write.frame("<html>Unable to generate cards.</html>");
		};
		reader.readAsText(fileToLoad);
	}

	function save() {
		var stringyData = JSON.stringify(context.form.getData());
		if (window.localStorage) {
			try {
				window.localStorage["hccdo"] = stringyData;
			} catch(e) {
				console.log("Error saving to local storage.");
			}
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
		templateOutput = formatter(cards.data,data.mustache);

		//Assemble webpage.
		fullOutput = '<!DOCTYPE html>\n<html>\n<head>\n\t    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>\n';
		fullOutput += '<link rel="stylesheet" href="css/hccdoCard.css">';
		fullOutput += externalLink;
		//Prepare for image.
		if (forImages) {
			fullOutput += '    <script type="text/javascript" src="lib/dom-to-image.min.js"></script>\n';
			fullOutput += '    <script type="text/javascript" src="lib/hccdoImage.js"></script>\n';
			fullOutput += '    <script type="text/javascript">var dpi = ' + context.form.get("dpi") + ';</script>\n';
		}
		fullOutput += "<style>\n" + data.css + "</style>";
		fullOutput += "\n</head><body>" + templateOutput + "\n</body>\n</html>\n";

		//Write to frame.
		context.write.frame(fullOutput);
	}

	function formatter(cards,template) {
		template = '{{#hccdo}}<div class="card">\n' + template + "\n</div>{{/hccdo}}";
		var rows = 2;
		var cols = 4;
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

	function saveCSV(csv,name) {
		if (window.localStorage) {
				try {
					window.localStorage[name] = csv;
				} catch (e) {}
		}
		return;
	}

})();

})(hccdo);

window.onload = hccdo.init.start;
