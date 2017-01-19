// Module for API Routes (serving JSON)

module.exports = function(app, passport) {
  const bodyParser = require('body-parser');
  const request = require('request');

  app.get('/api/closestAirport', function(req, res) {
    const lat = req.query.lat;
    const lng = req.query.lng;
    request(`http://iatageo.com/getCode/${lat}/${lng}`, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        res.status(200).send(JSON.parse(body));
      }
    });
	});

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    });

  const parseFlights = (body) => {
    let flights = [];
    body.trips.tripOption.forEach((trip)=> {
      let flight = { totalPrice: trip.saleTotal, totalDuration: trip.slice[0].duration };
      trip.slice.forEach( (slice) => {

        const firstSegment = slice.segment[0];
        const lastSegment = slice.segment[slice.segment.length - 1];

        const firstLeg = firstSegment.leg[0];
        const lastLeg = lastSegment.leg[0];

        const departureTime = new Date(firstLeg.departureTime).toLocaleTimeString().slice(0,-6);
        const arrivalTime = new Date(lastLeg.arrivalTime).toLocaleTimeString().slice(0,-6);

        let origins = [];
        let destinations = [];

        let departureTimes = [];
        let arrivalTimes = [];

        slice.segment.forEach((segment) => {
          const leg = segment.leg[0];
          const departureTime = new Date(leg.departureTime).toLocaleTimeString().slice(0,-6);
          const arrivalTime = new Date(leg.arrivalTime).toLocaleTimeString().slice(0,-6);
          departureTimes.push(departureTime);
          arrivalTimes.push(arrivalTime);
          origins.push({ iata: leg.origin, terminal: leg.originTerminal, duration: leg.duration });
          destinations.push({ iata: leg.destination, terminal: leg.destinationTerminal });
        });

        flight.departureTimes = departureTimes;
        flight.arrivalTimes = arrivalTimes;
        flight.origins = origins;
        flight.destinations = destinations;
        flight.connections = slice.segment.length - 1;
      });
      flights.push(flight);
    });

    return flights;
  };

  app.get('/api/flights', (req, res) => {
    const origin = req.query.origin;
    const dest = req.query.dest;
    let date = req.query.date;

    if (!date){
      const rightNow = new Date();
      date = rightNow.toISOString().slice(0,10).replace(/-/g,"-");
    }

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
        solutions: 2,
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
          res.status(400).send("There was an issue finding your flights!");
        }
        res.status(200).send(parseFlights(body));
      });
    } else{
      res.status(400).send("There was an issue finding your flights!");
    }

  });
};
