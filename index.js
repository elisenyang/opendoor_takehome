const express = require('express');

var app = express()

var filter = require('./filter.js')

app.get('/', function(req,res) {
  res.send('Connected')

})

app.get('/listings', function(req,res) {
  filter(req.query)
  .then(result => {
    let geoJSON = {
      "type": "FeatureCollection",
      "features": []
    }
    result.forEach(listing => {
      geoJSON.features.push({
        "type": "Feature",
        "properties": {
          "id": listing.id,
          "street": listing.street,
          "status": listing.status,
          "price": listing.price,
          "bedrooms": listing.bedrooms,
          "bathrooms": listing.bathrooms,
          "sq_ft": listing.sq_ft
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            listing.lat,
            listing.lng
          ]
        }
      })
    })
    res.send(JSON.stringify(geoJSON))
  })
})

app.listen(3000, function() {
    console.log('SERVER IS UP')
})
