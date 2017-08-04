const express = require('express');
const bodyParser = require('body-parser');
const hat = require('hat')
const jwt = require('jsonwebtoken');
const morgan = require('morgan')

//mongoose configuration
const mongoose = require('mongoose');
const connect = process.env.MONGODB_URI;
mongoose.connect(connect);

const models = require('./models');
const User = models.User



const app = express()
var apiRoutes = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'))

app.set('superSecret', process.env.SECRET)

app.get('/', function(req,res) {
  res.send('Connected')
})

//filter function
const filter = require('./filter.js')

app.get('/listings', function(req,res) {
  //filter using query & return array of filtered listings
  filter(req.query)
  .then(result => {
    let geoJSON = {
      "type": "FeatureCollection",
      "features": []
    }
    //convert each listing to geoJSON format
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

app.post('/register', function(req,res) {
  let apiKey = hat();

  let newUser = new User ({
    username: req.body.username,
    password: req.body.password,
    apiKey: apiKey
  })

  var token = jwt.sign(newUser, app.get('superSecret'));

  newUser.save(function(err) {
    if (err) {
      console.log("Save Error")
    } else {
      res.json({
        success: true,
        apiKey: apiKey,
        token: token
      });
    }
  })
})

app.post('/retrieve_key', function(req,res) {
  //find user in data store
  User.findOne({username: req.body.username}, function(err, user) {
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' })
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        res.json({success: true, apiKey: user.apiKey})
      }
    }
  })
})

app.post('/refresh_key', function(req,res) {
  User.findOne({apiKey: req.body.apiKey}, function(err, user) {
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' })
    } else {
      let newapiKey = hat()
      user.apiKey = newapiKey
      user.save(function(err) {
        if (err) {
          console.log('Save Error')
        } else {
          res.json({ success: true, apiKey: newapiKey })
        }
      })
    }
  })
})




apiRoutes.use(function(req, res, next) {
  // check header for token
  var token = req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});

app.use('/', apiRoutes);

app.listen(3000, function() {
    console.log('SERVER IS UP')
})

module.exports = app;
