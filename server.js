//define requirements
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./models/config');
var app = express();
var request = require('request');
var session = require('express-session');


//apply middleware
//NOTE: will need to change this route once we redo the file structure
app.use(session({
 // Secret hashes the session
 secret:'sssssshhhhhhhh',
 saveUninitialized: true,
 resave: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
    
//set up routes
//NOTE: will need to change this route once we redo the file structure
require('./router/router.js')(app);

//UNDERSTAND THIS LATER...
app.use(express.static(path.join(__dirname, "/public")));

//set up ports
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server listening on port ' + port);
});  

module.exports = app;
