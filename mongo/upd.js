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

//const privateKey = fs.readFileSync('privkey.pem', 'utf8');
//const certificate = fs.readFileSync('fullchain.pem', 'utf8');
//const ca = fs.readFileSync('cert.pem', 'utf8');

var redis = require('redis'),
    client = redis.createClient()

var proximity = require('geo-proximity').initialize(client)


const { Gateway, Wallets } = require('fabric-network');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bridgeyloaddb3');


var bridgeySchema = new mongoose.Schema({
  Longitude : { type: Number, default: null },
  Latitude : { type: Number, default: null},
  UserID : {type: Number, default: null},
  GPSDate : {type: String, default: null},
  GPSSquare : {type: Number, default: null},
});

var bridgeySqSchema = new mongoose.Schema({
  Longitude : { type: Number, default: null },
  Latitude : { type: Number, default: null},
  GPSSquare : {type: Number, default: null},
});


var bridgeyDB = mongoose.model("bridgeygps", bridgeySchema);
var bridgeyNewDB = mongoose.model("bridgeynewgps", bridgeySchema);
var bridgeySqDB = mongoose.model("bridgeysqs", bridgeySqSchema);

//const readInterface = readline.createInterface({
//    input: fs.createReadStream('./test.csv'),
//    output: process.stdout,
//    console: false
//});

//readInterface.on('line', function(line) {
//    console.log(line);
//});

function checkDist(doc) {
// 800 refers to 800 metres
    for (let i=0;i<doc.length;i++) {	
        proximity.nearby(doc[i]["Latitude"], doc[i]["Longitude"], 800, function(err, locations){
           if(err) console.error(err)
           else {
		   console.log('nearby locations:', locations)
		   for (let j=0;j<locations.length;j++) {

	           }
	   }
        })
    }
}

function insertNewDB (loc) {

}

function addDB(longitude, latitude, userid, gpsdate, sq) {
  var bridgeyCreate = new bridgeyNewDB({
    Longitude : longitude,
    Latitude : latitude,
    UserID : userid,
    GPSDate : gpsdate,
    GPSSquare: sq,	  
    });
    bridgeyCreate.save(function(err, doc){
        if(err) throw err;
         console.log("db done");
      });
}


function readDB() {

	bridgeySqDB.find( function(err, doc){
    if(doc != null){
	    console.log(doc);
	    checkDist(doc);
//	    addlocs(doc);
    }else{
	    console.log("error");
    }
  });
}

readDB();


