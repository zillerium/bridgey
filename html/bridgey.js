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







