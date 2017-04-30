//Script to scrape the user's collection of games with images from BGG.
//Creates a CSV for use in hccdo, or as you desire.
//By mcdemarco.  Uses YQL.

//Good test user: PzVIE, has 5000 games.

function scraper() {
	//Solicit the username.
	var username = window.prompt("Enter a BoardGameGeek username.");
	if (!username)
		return;
	//Assemble the YQL query URL.
	var yqURL = "https://query.yahooapis.com/v1/public/yql?q=";
	var bggURL = "https://boardgamegeek.com/collection/user/" + username + "?own=1&subtype=boardgame&ff=1&gallery=large&excludesubtype=boardgameexpansion";
	var yqXPATH = '//div[@id="collection"]/div/center';
	var yqSELECT = "select * from html where url='" + bggURL + "' and xpath='" + yqXPATH + "'";
	yqURL = yqURL + encodeURIComponent(yqSELECT) + "&format=json";

	//Make the request.
	scrape(yqURL,processor);
}

function scrape(url,callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
  xhr.onload = callback;
	xhr.send();
};

function processor() {
	var csvDelimiter = "\t";
	//Fragile.
	var scrapeArray = JSON.parse(this.responseText).query.results.center;
	var csvOutput = scrapeArray.reduce(function(acc,val){
		return acc + "\n" + flatten(val);
	}, ["src","width","height","name"].join(csvDelimiter));

	cardForm.data.csv = csvOutput;
	return;

	function flatten(object) {
		//Extract the desired info from the scraped and jsonified html (object).
		//Fragile.
		var flat = [];
		flat.push(object.a.img.src);
		var dims = object.a.img.style.trim().split(" ");
		flat.push(dims[0].split(":")[1].split(";")[0]);
		flat.push(dims[1].split(":")[1].split(";")[0]);
		flat.push(object.div.a.content);
		return flat.join(csvDelimiter);
	}
}
