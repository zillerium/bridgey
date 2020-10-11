function addgps() {
    longitude  = document.getElementById("longitude").value;
    latitude  = document.getElementById("latitude").value;
    userid  = document.getElementById("userid").value;

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST",  "http://3.80.157.235:3000/api/addPos", true);
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify({ "longitude": longitude, "latitude": latitude, "userid":userid }));
    xhttp.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        if (data.response === "ok") {
	      document.getElementById("message").innerHTML="The position was added";
	} else {
              document.getElementById("message").innerHTML="There was an error";
	}
      }
    };
}

function readgps() {

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST",  "http://3.80.157.235:3000/api/readPos", true);
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify({ "all": 1 }));
    xhttp.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
	var travel = [];
	for (let i=0;i<data.doc.length;i++) 
	      {
            let longitude1 = data.doc[i]["Longitude"].toString();
            let latitude1 = data.doc[i]["Latitude"].toString();
            let square = data.doc[i]["GPSSquare"];
            let userid = data.doc[i]["UserID"];
            let gpsdate = data.doc[i]["GPSDate"];
            let dateformat = gpsdate.split('T');
	    let yearformat = dateformat[0].split('-');
	    let year= yearformat[0];
	    let month= yearformat[1];
	    let day= yearformat[2];
	    let hourformat = dateformat[1].split('Z');
            let timeformat = hourformat[0].split(':');
            let hh = timeformat[0];
	    let mm = timeformat[1];
            let sss = timeformat[2];
            let ss = sss.substring(0,1);
            let secs =Number(month)*31*24*60*60+Number(day)*24*3600+ Number(hh)*3600 + Number(mm)*60 + Number(ss);  
            travel.push({
                 "sec":secs,"userid": userid, "longitude":longitude1, "latitude":latitude1, "square": square
	    });
        }
	      travel.sort(function(a,b) {
		      return parseFloat(a.sec) - parseFloat(b.price);
	      });
            let g=1;
	      for (var n=0;n<travel.length;n++) {

  		      var timenow = parseInt(Date.now()/1000);
		      var newtimenow = parseInt(Date.now()/1000);
	     	 let wait = true;
	     	 //do {
               //	 	 newtimenow = parseInt(Date.now()/1000);
	//		 if ((newtimenow - timenow) > 1) wait = false;
	//		 document.getElementById("message").innerHTML = (newtimenow-timenow).toString(); 
	  //    	 }
	    // 	 while (wait)
           //        setTimeout(stateChange, 2000);
		     displayData(travel[n]);
              //    setTimeout(displayData(travel[n], 2000000));
              }
      }
    };
}

function displayData(travelelement) {
                      let longitude=travelelement["longitude"].toString();
                      let latitude=travelelement["latitude"].toString();
                      let sq=travelelement["square"].toString();
                    let s1=document.getElementById("square1").innerHTML ;
                    let s2=document.getElementById("square2").innerHTML ;
                    let s3=document.getElementById("square3").innerHTML;
                    let s4=document.getElementById("sq4").innerHTML;
                    let s5=document.getElementById("square5").innerHTML ;
                    if (Number(sq) == 1) document.getElementById("square1").innerHTML =s1 + " " + longitude + " " + latitude;
                    if (Number(sq) == 2) document.getElementById("square2").innerHTML = s2+ " " +longitude + " " + latitude;
                    if (Number(sq) == 3) document.getElementById("square3").innerHTML = s3+" " +longitude + " " + latitude;
                    if (Number(sq) == 4) {document.getElementById("sq4").innerHTML = s4+" " +longitude + " " + latitude;}
                    if (Number(sq) == 5) document.getElementById("square5").innerHTML = s5+" "+longitude + " " + latitude;

}
function testf() {
let g=1;
}

function stateChange() {
	var f=1;
	f++;
}






