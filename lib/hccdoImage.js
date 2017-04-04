window.onload = function() {
	var node = document.getElementsByClassName("card")[0];
	domtoimage.toPng(node).then(function (dataUrl) {
    var img = new Image();
    img.src = dataUrl;
    document.body.appendChild(img);
  }).catch(function (error) {
    console.error('oops, something went wrong!', error);
  });
};
