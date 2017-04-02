// hccdo by mcdemarco
// a pure-js ("online") version of hccd

//Todo: store the csv.
//      make rows/cols configurable

window.onload = (function() {

	//Get the template and the filename minus .htm(l).
	var rootname = window.location.pathname.replace(/^.*[\\\/]/, '').split('.')[0];
	var template = document.getElementById("template").innerHTML;

	//Load the stylesheet.
	var fileref = document.createElement("link");
	fileref.rel = "stylesheet";
	fileref.type = "text/css";
	fileref.href = rootname + ".css";
	document.getElementsByTagName("head")[0].appendChild(fileref);
	
	//Load the csv.
	var fileInput = document.getElementById('fileInput');

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var reader = new FileReader();
			
		reader.onload = function(e) {
			var cards = Papa.parse(reader.result, {
				header: true,
				skipEmptyLines: true
			});
			var htmlOutput = formatter(cards.data);
			document.getElementById("hccdoutput").innerHTML = htmlOutput;
		};
		reader.onerror = function(e) {
			document.getElementById("hccdoutput").innerHTML = "An error occurred.";
		};
		reader.readAsText(file);
	});

	function formatter(cards) {
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
});
