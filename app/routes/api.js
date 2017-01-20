// Module for API Routes (serving JSON)

module.exports = function(app) {
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

  const parseFlights = (body) => {
    let flights = [];
    body.trips.tripOption.forEach((trip)=> {
      let flight = { totalPrice: trip.saleTotal, totalDuration: trip.slice[0].duration };
      trip.slice.forEach( (slice) => {

        let origins = [];
        let destinations = [];

        let departureTimes = [];
        let arrivalTimes = [];

        slice.segment.forEach((segment) => {
          const flight = segment.flight;
          segment.leg.forEach((leg) => {
            const departureTime = new Date(leg.departureTime).toLocaleTimeString();
            const arrivalTime = new Date(leg.arrivalTime).toLocaleTimeString();
            departureTimes.push(departureTime);
            arrivalTimes.push(arrivalTime);
            origins.push({ iata: leg.origin, terminal: leg.originTerminal, duration: leg.duration, flight: flight });
            destinations.push({ iata: leg.destination, terminal: leg.destinationTerminal });
          });
        });

        flight.departureTimes = departureTimes;
        flight.arrivalTimes = arrivalTimes;
        flight.origins = origins;
        flight.destinations = destinations;
        flight.connections = origins.length - 1;
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
        solutions: 10,
        refundable: false
      }
    };
    const url = "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBGEWdCRS271v9FklxQprp2LNpzdOK2Ins";
    if (origin && dest && date){
      request({
        url: url,
        method: "POST",
        json: requestData
        }, (err, response, body) => {
        if (err || body.error) {
          res.status(400).send("There was an issue finding your flights!");
        } else if (body.trips.tripOption){
          res.status(200).send(parseFlights(body));
        } else{
          res.status(400).send("There was an issue finding your flights!");
        }
      });
    } else{
      res.status(400).send("Make sure to fill in all fields!");
    }
  });
};
