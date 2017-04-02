// hccdo by mcdemarco
// a pure-js ("online") version of hccd

//Todo: store the csv.
//      make rows/cols configurable

var hccdo = {};

(function(context) { 

context.init = (function () {

	return {
		start: start,
		generate: generate
	};

	function start() {
		//Get the template and the filename minus .htm(l).
		var rootname = window.location.pathname.replace(/^.*[\\\/]/, '').split('.')[0];
		loadStylesheet(rootname);
		getCSV(rootname);
	}

	function loadStylesheet(name) {
		//Load the stylesheet.
		var fileref = document.createElement("link");
		fileref.rel = "stylesheet";
		fileref.type = "text/css";
		fileref.href = name + ".css";
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}
	
	function getCSV(name) {
		//Check for csv in local storage; otherwise ask to load.
		var csv;
		if (localStorage && localStorage[name]) {
			csv = localStorage[name];
			generate(csv);
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
				generate(reader.result);
				saveCSV(reader.result,name);
			};
			reader.onerror = function(e) {
				document.getElementById("hccdoutput").innerHTML = "An error occurred.";
			};
			reader.readAsText(file);
		});
	}

	function generate(csv) {
		var cards = Papa.parse(csv, {
			header: true,
			skipEmptyLines: true
		});
		var htmlOutput = formatter(cards.data);
		document.getElementById("hccdoutput").innerHTML = htmlOutput;
	}

	function formatter(cards) {
		var template = document.getElementById("template").innerHTML;
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
			formatted += Mustache.to_html(template, {card: cards[c]});
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

})();

})(hccdo);

window.onload = hccdo.init.start;
