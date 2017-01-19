// Module for API Routes (serving JSON)

module.exports = function(app, passport) {
  const bodyParser = require('body-parser');
  const request = require('request');
  app.get('/api/closestAirport', function(req, res) {

    const lat = req.query.lat;
    const lng = req.query.lng;
    console.log(lat);
    console.log(lng);
    request(`http://iatageo.com/getCode/${lat}/${lng}`, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log('YAHOOO');
        res.status(200).send(JSON.parse(body));
      }
    });
	});

  app.get('/auth/facebook',
    passport.authenticate('facebook'));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      console.log(req);
      // Successful authentication, redirect home.
      res.redirect('/');
    });

  app.get('/api/flights', function(req, res) {
    const origin = req.query.origin;
    const dest = req.query.dest;
    let date = req.query.date;
    console.log(origin);
    console.log(dest);

    if (!date){
      const rightNow = new Date();
      date = rightNow.toISOString().slice(0,10).replace(/-/g,"-");
    }

    console.log(date);
    const requestData = {
      request: {
        slice: [
          {
            origin: origin,
            destination: dest,
            date: date
          }
        ],
        passengers: {
          adultCount: 1,
          infantInLapCount: 0,
          infantInSeatCount: 0,
          childCount: 0,
          seniorCount: 0
        },
        solutions: 5,
        refundable: false
      }
    };

    const url = "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyAhLrGr_pB9LfaCyZB-t996vIu59Lz5BN4";

    if (origin && dest && date){
      request({
        url: url,
        method: "POST",
        json: requestData
        }, (err, response, body) => {
        if (err) {
          console.log('error');
          res.status(400).send("There was an issue finding your flights!");
        }
        console.log('Upload successful!  Server responded with:', body);
        res.status(200).send(JSON.parse(body));
      });
    } else{
      console.log('error');
      res.status(400).send("There was an issue finding your flights!");
    }

  });
};
