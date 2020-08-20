const bodyParser = require('body-parser');
const path = require('path')
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
const fs = require('fs');
var schedule = require('node-schedule');
const {createCanvas} = require('canvas');

const dir = path.join(__dirname, 'public');
app.use(express.static(dir));

var globalText1 = '';
var globalText2 = '';

const port = 3333;


// ***Use Zoom api to get # meetings in progress. ***


function genBanner(width, height, text, text2=''){

	const canvas = createCanvas(width, height);
	const context = canvas.getContext('2d');

	//paint entire box white
	context.fillStyle = '#fff'
	context.fillRect(0, 0, width, height)

	//alignt text
	context.font = 'bold 60pt Arial'
	context.textAlign = 'left'
	context.textBaseline = 'top'

	context.fillStyle = '#000'
	context.fillText("Announcement:", 10, 125)

	context.font = 'bold 60pt Arial'
	context.fillStyle = '#000'
	context.fillText('-'+text, 10, 275,1000)

	context.fillStyle = '#000'
	context.fillText('-'+text2, 10, 425,1000)

    var datetime = new Date();
    today = datetime.toISOString();
    //console.log("today: ", today);
    //today = today.slice(0,10);


	//context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120)
	context.fillStyle = '#000'
	context.font = 'bold 50pt Arial'
	context.fillText(today, 10,10)

	//write image
	const buffer = canvas.toBuffer('image/png')
	fs.writeFileSync('./public/image.png', buffer)


}

//takes in text and updates image accordingly
app.get('/updateText', function(req, res) {

	//need key 
	//need checks for char limit
	key = req.query.key;

	if(key != "secret") {

		res.status(401)
		res.send("access denied!");

	}
	else {

		text = req.query.text;
		text2 = req.query.text2
		globalText1 = text;
		globalText2 = text2;

		console.log(text);
		console.log(text2);
		genBanner(1200, 600, text, text2);

		res.status(200);
		res.send(text);

	}

});

app.listen(port, function() {

	console.log("Server started.");

	//scheduled job.
	var j = schedule.scheduleJob('* */1 * * * *', function(fireDate){

	    genBanner(1200,600,globalText1,globalText2);

  	});

});

