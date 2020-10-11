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

var redis = require('redis'),
    client = redis.createClient()

var proximity = require('geo-proximity').initialize(client)


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

//db done {
 // Longitude: 1602432663801,
 // Latitude: -84.578062,
//  UserID: 39.18974,
//  GPSDate: '228',
//  GPSSquare: null,
//  _id: 5f832e970c187c131c5589e9,
//  __v: 0
//}
async function addGPS(longitude, latitude, userid, GPSDate, GPSSquare,gpsNumber) {
    try {
        const ccpPath1 = "./fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json";
        const ccp = JSON.parse(fs.readFileSync(ccpPath1, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        await contract.submitTransaction('createGPS',gpsNumber, longitude, latitude, userid, GPSDate);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}


async function addDB(longitude, latitude, userid, gpsdate, square) {
  var bridgeyCreate = new bridgeyDB({
    Longitude : longitude,
    Latitude : latitude,
    UserID : userid,
    GPSDate : gpsdate,
GPSSquare: square
    });
	var doc =1;
    bridgeyCreate.save(function(err, doc){
        if(err) throw err;
         console.log("db done", doc);
       console.log("id",doc);
                           console.log("id string", doc["_id"]);
                           addGPS(longitude, latitude, userid, gpsdate, square,doc["_id"])

      });
      return doc;
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

async function checkDist(longitude, latitude, userid, gpsdate) {
// 800 refers to 800 metres
	var x=0;
	console.log("longitude",longitude);
	console.log("latitude",latitude);
        proximity.nearby(latitude, longitude, 800, function(err, locations){
           if(err) console.error(err)
           else {
		   console.log("len",locations.length);
		   if (locations.length>0) {
		console.log("cond met", gpsdate);
                       x=1;
			   var id = addDB(   longitude, latitude, userid,gpsdate, 1);
	//		   console.log("id",id);
	//		   console.log("id string", id["_id"]);
//			   addGPS(longitude, latitude, userid, gpsdate, x,id["_id"]) 
		   }
	   }
        })
	return x;
}


function addLocs(longitude, latitude) {
 var items=[];
            let locationlabel = "xx";
            let loc = [latitude, longitude, locationlabel];
            items.push(loc);
        proximity.addLocations(items, function(err, reply){
  if(err) console.error(err)
  else console.log('added items:', reply)
})
}

app.post("/api/addPos", asyncHandler(async (req, res, next) => {

        var longitude = req.body.longitude;
        var latitude = req.body.latitude;
        var userid = req.body.userid;
        var accesscode = req.body.accesscode;
        var gpsdate = new Date();

	console.log(longitude);
	console.log(latitude);
	addLocs(longitude, latitude);
	var square = await checkDist(longitude, latitude, userid, gpsdate);
	console.log("square",square);
//        var id = addDB(   longitude, latitude, userid,gpsdate, square) 
        //console.log(id);
        res.json({"response": "ok"})

}));

// Starting both http & https servers
//const httpsServer = https.createServer(credentials, app);


const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
    console.log('HTTP Server running on port 3000');
});


