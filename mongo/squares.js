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

const { Gateway, Wallets } = require('fabric-network');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bridgeyloaddb3');


var bridgeySchema = new mongoose.Schema({
  Longitude : { type: Number, default: null },
  Latitude : { type: Number, default: null},
  GPSSquare : {type: Number, default: null},
});
   
var bridgeyDBPt = mongoose.model("bridgeysq", bridgeySchema);

//const readInterface = readline.createInterface({
//    input: fs.createReadStream('./test.csv'),
//    output: process.stdout,
//    console: false
//});

//readInterface.on('line', function(line) {
//    console.log(line);
//});

function addDB(longitude, latitude, userid, gpsdate, gpsSquare) {
  var bridgeyCreate = new bridgeyDB({
    Longitude : longitude,
    Latitude : latitude,
    UserID : userid,
    GPSDate : gpsdate,
	  GPSSquare: gpsSquare,
    });
    bridgeyCreate.save(function(err, doc){
        if(err) throw err;
         console.log("db done");
      });
}

function addDBPt(longitude, latitude, gpsSquare) {
  var bridgeyCreate = new bridgeyDBPt({
    Longitude : longitude,
    Latitude : latitude,
          GPSSquare: gpsSquare,
    });
    bridgeyCreate.save(function(err, doc){
        if(err) throw err;
         console.log("db done");
      });
}

addDBPt(39.189740, -84.589062, 1);
addDBPt(39.189061, -84.573242, 2);
addDBPt(39.200062, -84.588798, 3);
addDBPt(39.190852, -84.605473, 4);
addDBPt(39.180592, -84.589345, 5);
