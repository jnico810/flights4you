// Module for API Routes (serving JSON)

module.exports = function(app) {
  const bodyParser = require('body-parser');
  const request = require('request');
  app.get('/api/closestAirport', function(req, res) {
		// Displaying an already made view
    console.log("ok");
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
};
