// hccdo by mcdemarco
// a pure-js ("online") version of hccd

//Todo: store the csv.
//      make rows/cols configurable

var hccdo = {};

(function(context) { 

context.init = (function () {

	return {
		start: start
	};

	function start() {
		context.input.show();
	}

})();

context.form = (function () {

	return {
		clear: clear,
		populate: populate,
		read: read
	};
	
	function clear() {
		document.getElementById("hccdoProjectName").value = "";
		document.getElementById("extCSS").value = "";
		document.getElementById("cssStoredTextarea").value = "";
		document.getElementById("csvStoredTextarea").value = "";
		document.getElementById("tmplStoredTextarea").value = "";
		//Also clear iframe.
	}

	function populate(data) {
		document.getElementById("hccdoProjectName").value = data.name;
		document.getElementById("extCSS").value = data.extCSS;
		document.getElementById("cssStoredTextarea").value = data.css;
		document.getElementById("csvStoredTextarea").value = data.csv;
		document.getElementById("tmplStoredTextarea").value = data.tmpl;
	}

	function read() {
		var data = {};
		data.name = document.getElementById("hccdoProjectName").value;
		data.google = document.getElementById("extCSS").value;
		data.css = document.getElementById("cssStoredTextarea").value;
		data.csv = document.getElementById("csvStoredTextarea").value;
		data.tmpl = document.getElementById("tmplStoredTextarea").value;
		return data;
	}

})();

context.input = (function () {

	//Data loading and storage functions.

	return {
		load: load,
		show: show
	};

	function load(Stylesheet,name) {
		//Load the stylesheet.
		var fileref = document.createElement("link");
		fileref.rel = "stylesheet";
		fileref.type = "text/css";
		fileref.href = name + ".css";
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}

	function show() {
		var data = getData();
		context.form.populate(data);
		context.write.generate(data);
	}
	
	function getData() {
		var data = {};
		if (localStorage && localStorage["hccdoProjectName"])
			data = getDataFromStorage();
		else {
			//The default data.
			data.name = 'example';
			data.css = ".wrapper {\n    display: flex;\n    flex: 1;\n    flex-direction: column;\n    justify-content: space-between;\n    font-family: Raleway, sans-serif;\n    font-size: 14pt;\n    width: 100%;\n    height: 100%;\n}\n\n.corner {\n    display: flex;\n    flex: 2;\n    align-items: flex-start;\n    flex-direction: row;\n    font-weight: 600;\n    padding: 10pt;\n}\n.main {\n    display: flex;\n    flex: 4;\n    align-items: center;\n    justify-content: flex-start;\n    flex-direction: column;\n    justify-content: space-between;\n    font-family: 'Cherry Swash', sans-serif;\n    font-size: 48pt;\n}\n\n";
			data.csv = 'Number\n2\n3\n4\n5\n6\n7\n8\n9\n10\n13\n16';
			data.tmpl = '<div class="wrapper">\n\t<div class="corner">{{Number}}</div>\n\t<div class="main font-effect-shadow-multiple">\n\t\t<div>{{Number}}</div>\n\t</div>\n</div>';
			data.extCSS = 'https://fonts.googleapis.com/css?family=Raleway|Cherry+Swash&effect=shadow-multiple';
		}
		return data;
	}

	function getCSV(name) {
		//Check for csv in local storage; otherwise ask to load.
		var csv;
		if (localStorage && localStorage[name]) {
			csv = localStorage[name];
			context.write.generate(csv);
		} else
			loadCSV(name);
	}
	
	function loadCSV(name) {
		//Get csv using html5.
		var htmlInput = '<h1>Load Your CSV File</h1><div>Select a csv file: <input type="file" id="fileInput"></div>';
		document.getElementById("hccdoutput").innerHTML = htmlInput;

		var fileInput = document.getElementById('fileInput');
		
		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var reader = new FileReader();
			
			reader.onload = function(e) {
				context.write.generate(reader.result);
				context.load.saveCSV(reader.result,name);
			};
			reader.onerror = function(e) {
				document.getElementById("hccdoutput").innerHTML = "An error occurred.";
			};
			reader.readAsText(file);
		});
	}
})();

context.write = (function () {

	return {
		generate: generate,
		imagine: imagine
	};

	function generate(data) {
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
		if (data.extCSS.length > 0)
			externalLink = '\t<link href="' + data.extCSS +'" rel="stylesheet">';

		//Apply template.
		templateOutput = formatter(cards.data,data.tmpl);

		//Assemble webpage.
		fullOutput = '<!DOCTYPE html>\n<html>\n<head>\n\t    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>\n';
		fullOutput += '<link rel="stylesheet" href="css/hccdoCard.css">';
		fullOutput += externalLink;
		fullOutput += "<style>\n" + data.css + "</style>";
		fullOutput += "\n</head><body>" + templateOutput + "\n</body>\n</html>\n";

		//Write to frame.
		var ifrm = document.getElementById("hccdoOutput");
		ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
		ifrm.document.open();
		ifrm.document.write(fullOutput);
		ifrm.document.close();
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
		if (localStorage) {
				try {
					localStorage[name] = csv;
				} catch (e) {}
		}
		return;
	}

	function imagine() {
		var node = document.getElementById("hccdoutput");

		domtoimage.toPng(node).then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      document.body.appendChild(img);
    }).catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
	}

})();

})(hccdo);

window.onload = hccdo.init.start;
