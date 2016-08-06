//Set up, all the tools we need ==============================================================================
var express = require("express");
var app = express();

var path = require("path");
var port = process.env.PORT || '8080';
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");

var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var expressSession = require("express-session");

var configDB = require('./config/database.js');

//Configuration ==============================================================================================
mongoose.connect(configDB.url);

require("./config/passport")(passport); // pass passport for configuration

//To be able to access css for example 
app.use(express.static(path.join(__dirname, 'public')));

//Set up express application

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine','pug'); // set up pug for templating

//Required for passport
app.use(expressSession({secret:'devSecretYeah',resave: true,
    saveUninitialized: true})); // Session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//Put in every response the isAuthenticated OR Not, for the jade template


//Routes =====================================================================================================
app.use(function(req,res,next){
    res.locals.isauthenticated = req.isAuthenticated();
    next();
});
var routes = require("./app/routes/routes");
routes(app,passport); //Lod the routes and pass in our app and passport
var pollRoutes = require("./app/routes/poll");
pollRoutes(app);
//Launch =====================================================================================================
app.listen(port,function(){
    console.log("App running on "+ port + " let's start doing some magic");
});