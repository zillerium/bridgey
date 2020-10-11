var redis = require('redis'),
    client = redis.createClient()

var proximity = require('geo-proximity').initialize(client)

proximity.location('Toronto', function(err, location){
  if(err) console.error(err)
  else console.log(location.name + "'s location is:", location.latitude, location.longitude)
})

proximity.nearby(39.189740, -84.589062, 800, function(err, locations){
  if(err) console.error(err)
  else console.log('nearby locations:', locations)
})
