const express = require('express');
const app = express();
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash'); //to display message that user was successfully registered
const session = require('express-session');
const passport = require('passport');

require('dotenv/config');

//Passport config
require('./config/passport')(passport);

//Bodyparser
//app.use(bodyParser.json());
app.use(express.urlencoded( { extended: false } ));

app.use(expressLayouts);
app.set('view engine', 'ejs');

//Express Session
app.use(
   session({
     secret: 'secret',
     resave: true,
     saveUninitialized: true
   })
 );

 // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());


//Global vars
app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
});

//Import routes
const indexRoute = require('./routes/index.js');
app.use('/', indexRoute);

const usersRoute = require('./routes/users.js');
app.use('/users', usersRoute);

const placesRoute = require('./routes/places.js');
app.use('/places', placesRoute);


//Connection to database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => 
   console.log('Connected to database')
);

const PORT = process.env.PORT || 8080;
app.listen(PORT);