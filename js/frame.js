//Script to generate CardPen images in frame using dom-to-image.
//The dimensions and sanitized projectName are loaded elsewhere on the page.

var cards = [];

window.onload = function() {
	var nodes = document.getElementsByTagName("card");
	for (var n = 0; n < nodes.length; n++) {
		imaginer(nodes[n],n);
	}
}

function imaginer(node,n) {
	//Need to pass height and width due to an issue with oversized transparent canvases (#50).
	domtoimage.toPng(node, { height: height, width: width, dpi: dpi }).then(function (dataUrl) {
		cards[n] = dataUrl;
		var img = new Image();
		img.src = dataUrl;
		document.getElementById("cpImages").appendChild(img);
	}).catch(function (error) {
		var msg = 'Something went wrong!  Your browser may not support image generation.';
		document.getElementById("cpError").innerHTML = msg;
		if (console) 
			console.error(msg, error);
	});
}
	
function zipper() {
	var zip = new JSZip();
	var cardZip = zip.folder(projectName);
	
	for (var c = 0; c < cards.length; c++) {
		var commaIdx = cards[c].indexOf(",");
		//Zero fill for the file name, and add one because CardPen indexes from 1.
		var zerofillplus = ('000'+(c+1)).slice(-3);
		cardZip.file(projectName + zerofillplus + ".png", cards[c].slice(commaIdx + 1), {base64: true}); 
	}
  zip.generateAsync({type:"blob"}).then(function(file){
    saveAs(file, projectName + "_cards.zip");
  });
}
