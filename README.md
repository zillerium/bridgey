# bridgey

Hackathon 

1. Create data records into a big data db based on device readings
2. Bridge data into blockchains
3. Scale Solution

Server API

Test - add gps data into mongodb

curl  -X POST -d @addgps.json -H "Content-Type: application/json" http://3.80.157.235:3000/api/addPos

addgps.json
{
"longitude":-84.599453,
"latitude":39.198647,
"userid":1234,
"accesscode":921
}

Sample Data File - 
https://data.cincinnati-oh.gov/Efficient-Service-Delivery/Vehicle-GPS-Data-Department-of-Public-Services/b56d-ydmm

MongoDB - 

db.bridgeygps.find()
{ "_id" : ObjectId("5f812fe6d050496b8538704e"), "Longitude" : 1602301926590, "Latitude" : -84.599453, "UserID" : 39.198647, "GPSDate" : ISODate("1970-01-01T00:00:01.234Z"), "__v" : 0 }
> 

