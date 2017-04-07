//Script to generate images in frame using dom-to-image.
//The dpi and projectName variables are loaded elsewhere on the page.

var cards = [];

window.onload = function() {
	var nodes = document.getElementsByClassName("card");
	for (var n = 0; n < nodes.length; n++) {
		domtoimage.toPng(nodes[n], { dpi: dpi }).then(function (dataUrl) {
			cards.push(dataUrl);
			var img = new Image();
			img.src = dataUrl;
			document.getElementById("hccdoImages").appendChild(img);
		}).catch(function (error) {
			console.error('oops, something went wrong!', error);
		});
	}
}
	
function zipper() {
	var zip = new JSZip();
	var cardZip = zip.folder("cards");
	
	for (var c = 0; c < cards.length; c++) {
		var commaIdx = cards[c].indexOf(",");
		cardZip.file(c+".png", cards[c].slice(commaIdx + 1), {base64: true}); 
	}
  zip.generateAsync({type:"blob"}).then(function(file){
    saveAs(file, projectName + "_cards.zip");
  });
}
