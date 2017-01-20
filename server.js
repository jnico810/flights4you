// Dependencie
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http').Server(app);

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./app/routes/api')(app);
require('./app/routes/routes')(app);


const port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log(`listening on ${port}`);
});
