// Dependencie
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http').Server(app);

// log every request to the console
app.use(morgan('dev'));

// For parsing HTTP responses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Express Routes
require('./app/routes/api')(app);
require('./app/routes/routes')(app);

// Start the app with listen and a port number

const port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log(`listening on ${port}`);
});
