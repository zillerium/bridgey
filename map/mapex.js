const openGeocoder = require('node-open-geocoder');

openGeocoder()
.reverse(-84.589062, 39.189740)
.end((err, res) =>{
    console.log(res)
})
