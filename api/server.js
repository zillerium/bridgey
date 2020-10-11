// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');

const express = require('express');
const asyncHandler = require('express-async-handler');

const app = express();
//const { Pool, Client } = require('pg')
const pg = require('pg');

require('dotenv').config();

request = require('request');
const bodyParser = require('body-parser');
var wget = require('node-wget');
var url = require('url');
var path = require('path');

//const privateKey = fs.readFileSync('privkey.pem', 'utf8');
//const certificate = fs.readFileSync('fullchain.pem', 'utf8');
//const ca = fs.readFileSync('cert.pem', 'utf8');

const { Gateway, Wallets } = require('fabric-network');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bridgeyloaddb3');

//const credentials= {
 // key: privateKey,
//	cert: certificate
//}

app.get("/api/ping", function(req, res) {
    res.json({ message: "pong" });
});

app.use('/', express.static(path.join(__dirname, '/html')));

//app.use((req, res) => {
//	res.send('Hello there !');
//});
/*app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, x-access-token');
    next();
});*/
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var bridgeySchema = new mongoose.Schema({
  Longitude : { type: Number, default: null },
  Latitude : { type: Number, default: null},
  UserID : {type: Number, default: null},
  GPSDate : {type: String, default: null},
  GPSSquare : {type: Number, default: null},
});
   
var bridgeyDB = mongoose.model("bridgeynewgps", bridgeySchema);

async function addDB(longitude, latitude, userid, gpsdate) {
  var bridgeyCreate = new bridgeyDB({
    Longitude : longitude,
    Latitude : latitude,
    UserID : userid,
    GPSDate : gpsdate
    });
    bridgeyCreate.save(function(err, doc){
        if(err) throw err;
         console.log("db done");
      });
}


function readDB() {

        bridgeyDB.find( function(err, doc){
    if(doc != null){
//          console.log(doc);
            addlocs(doc);
    }else{
            console.log("error");
    }
  });
}

app.post("/api/readPos", asyncHandler(async (req, res, next) => {

        bridgeyDB.find( function(err, doc){
    if(doc != null){
//          console.log(doc);
        //    addlocs(doc);
	    res.json({"doc": doc});
    }else{
            console.log("error");
    }
  });



}));


app.post("/api/addPos", asyncHandler(async (req, res, next) => {

        var longitude = req.body.longitude;
        var latitude = req.body.latitude;
        var userid = req.body.userid;
        var accesscode = req.body.accesscode;
        var gpsdate = new Date();

	console.log(longitude);
	console.log(latitude);
        addDB(  gpsdate, longitude, latitude, userid) 
        res.json({"response": "ok"})

}));

// Starting both http & https servers
//const httpsServer = https.createServer(credentials, app);


const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
    console.log('HTTP Server running on port 3000');
});


