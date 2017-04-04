//Script to generate images in frame using dom-to-image.
//The dpi is loaded elsewhere on the page.

window.onload = function() {
	var node = document.getElementsByClassName("card")[0];
	domtoimage.toPng(node,  { dpi: dpi }).then(function (dataUrl) {
    var img = new Image();
    img.src = dataUrl;
    document.body.appendChild(img);
  }).catch(function (error) {
    console.error('oops, something went wrong!', error);
  });
};
