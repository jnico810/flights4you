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
    console.log(origin);
    console.log(dest);
    const rightNow = new Date();
    const formattedDate = rightNow.toISOString().slice(0,10).replace(/-/g,"");

    const apiReq = {
      request: {
        passengers: {
          adultCount: "1"
        },
        slice: [
          {
            origin: origin,
            destintation: dest,
            date: formattedDate
          }
        ],
        solutions: "1"
      }
    };

    request.post({url:'https://www.googleapis.com/qpxExpress/v1/trips/search', form: apiReq},
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log('google yahoo');
        res.status(200).send(JSON.parse(body));
      }
    });
	});
};
