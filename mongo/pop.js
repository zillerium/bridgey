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

function addDB(longitude, latitude, userid, gpsdate) {
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

function readfile() {
try {
    // read contents of the file
    const data = fs.readFileSync('veh.csv', 'UTF-8');

    // split the contents by new line
    const lines = data.split(/\r?\n/);
    var i=0;
    // print all lines
    lines.forEach((line) => {
	   if ((i>30000) && (i<40000)) {
       		console.log(line);
		let gps = line.split(',');
                let gpsfiledate = gps[3];
		let dateformat = gpsfiledate.split(' ');
                let datesarr=dateformat[0].split('/');
		let yyyy = datesarr[2];
		let mm = datesarr[1];
		let dd = datesarr[0];
		let timearr = dateformat[1].split(':');
		let hh = Number(timearr[0]);
		let min = timearr[1];
		let ss = timearr[2];
		let ampm = dateformat[2];
		var newdd =Number(dd);
		var newmm = Number(mm);
		var newyy = Number(yyyy);
		console.log("=========");
		console.log(ampm);
                if (ampm.toString().trim() === "PM") {
			hh = hh+12;
			if (hh > 24) {
                            hh =hh - 12;
			    newdd = newdd + 1;
		            if (newdd > 31) {
                                newdd = 1;
				newmm = newmm+1;
				if (newmm> 12) {
					newmm=1;
					newyy=newyy+1;
				}
			    }
			}
		}
		var newmmstr = newmm.toString();   
		if (newmm<10) {
	            newmmstr = "0"+newmm.toString();
		
		}
		var newddstr = newdd.toString();
		if (newdd<10) {
                    newddstr = "0"+newdd.toString();
                }   
		var newgpsdate = newyy.toString()+"-"+newmmstr+ "-"+newddstr+ "T" +(hh<10? "0"+hh.toString() : hh.toString())+":"+min+":"+ss+"1Z";   
		let gpsdate = new Date();
		   console.log(gps[0]);
		   console.log(gps[1]);
		   console.log(gps[2]);
		   console.log(gps[3]);
		   console.log(gps[4]);
		   console.log(newgpsdate);
		addDB(gps[2],gps[1],gps[0],newgpsdate);
	   }
	   i++;
    });
} catch (err) {
    console.error(err);
}

}

function readfile1() {

	//lineReader.eachLine('./test.csv', function(line) {
	//	    console.log(line);
//	});
	lineReader.open('.test.csv', function(reader) {
    	if (reader.hasNextLine()) {
            reader.nextLine(function(line) {
            console.log(line);
            });
   	   }
	});

//        addDB(  gpsdate, longitude, latitude, userid) 

}

readfile();

