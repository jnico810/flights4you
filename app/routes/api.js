// Module for API Routes (serving JSON)

module.exports = function(app) {
	// var mongoose = require('mongoose'),
  app.get('/api/airport', function(req, res) {
		// Displaying an already made view
		res.status(200).send('airline test');
	});
};
