// Dependencie
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http').Server(app);
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: "1147962611987399",
    clientSecret: "04cf1ac5b3044e187eb7f465299ed59d",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  (accessToken, refreshToken, profile, cb) => {
  		cb(null, profile);
    })
  );

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


// log every request to the console
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
// For parsing HTTP responses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Express Routes
require('./app/routes/api')(app, passport);
require('./app/routes/routes')(app);

// Start the app with listen and a port number
const port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log(`listening on ${port}`);
});
