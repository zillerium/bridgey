// Dependencies
const fs = require('fs');

const asyncHandler = require('express-async-handler');

//const { Pool, Client } = require('pg')
const pg = require('pg');

require('dotenv').config();

request = require('request');
const bodyParser = require('body-parser');
var wget = require('node-wget');
var url = require('url');
var path = require('path');
const readline = require('readline');
const lineReader = require('line-reader');

var redis = require('redis'),
    client = redis.createClient()

var proximity = require('geo-proximity').initialize(client)


//const privateKey = fs.readFileSync('privkey.pem', 'utf8');
//const certificate = fs.readFileSync('fullchain.pem', 'utf8');
//const ca = fs.readFileSync('cert.pem', 'utf8');

const { Gateway, Wallets } = require('fabric-network');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bridgeyloaddb3');


var bridgeySchema = new mongoose.Schema({
  Longitude : { type: Number, default: null },
  Latitude : { type: Number, default: null},
  UserID : {type: Number, default: null},
  GPSDate : {type: String, default: null},
});
   
var bridgeyDB = mongoose.model("bridgeygps", bridgeySchema);

//const readInterface = readline.createInterface({
//    input: fs.createReadStream('./test.csv'),
//    output: process.stdout,
//    console: false
//});

//readInterface.on('line', function(line) {
//    console.log(line);
//});
//
//
function addlocs(doc) {
	var limitcnt = doc.length;
	var items = [];

	// new Array(doc.length);
    for (let i=0;i<limitcnt;i++) {
	    let longitude = doc[i]["Longitude"];
	    let latitude = doc[i]["Latitude"];
	    let locationlabel = doc[i]["_id"];
	   // console.log(longitude, latitude, locationlabel);
	    let loc = [latitude, longitude, locationlabel.toString()];
	    items.push(loc);
	 //   console.log(items[i]);
    }
 //   for (let j=0;j<doc.length;j++) {
  //      console.log(j, items[j][1]);
  //  }
//	console.log(items);
	proximity.addLocations(items, function(err, reply){
  if(err) console.error(err)
  else console.log('added items:', reply)
})
}
function readDB(userid) {

	bridgeyDB.find({ UserID : userid}, function(err, doc){
    if(doc != null){
//	    console.log(doc);
	    addlocs(doc);
    }else{
	    console.log("error");
    }
  });
}




readDB(262);

