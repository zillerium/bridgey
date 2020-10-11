var redis = require('redis'),
    client = redis.createClient()

var proximity = require('geo-proximity').initialize(client)

var locations = [[43.6667, -79.4167,  'Toronto'],
                 [39.9523, -75.1638,  'Philadelphia'],
                 [37.4688, -122.1411, 'Palo Alto'],
                 [37.7691, -122.4449, 'San Francisco'],
                 [47.5500, -52.6667,  'St. John\'s'],
                 [40.7143, -74.0060,  'New York'],
                 [49.6500, -54.7500,  'Twillingate'],
                 [45.4167, -75.7000,  'Ottawa'],
                 [51.0833, -114.0833, 'Calgary'],
                 [18.9750, 72.8258,   'Mumbai']]

console.log(locations[1][0]);

//proximity.addLocations(locations, function(err, reply){
//  if(err) console.error(err)
//  else console.log('added locations:', reply)
//})
