const express = require('express');
const app = express();
const mongoose = require('mongoose');
<<<<<<< HEAD
//const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash'); //to display message that user was successfully registered
const session = require('express-session');
const passport = require('passport');

require('dotenv/config');
=======
const bodyParser = require('body-parser');
//require('dotenv/config');
>>>>>>> 6bc7ee9aa98611a5c310939996174f95b84b7086

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


<<<<<<< HEAD
=======
//ROUTES
app.get('/', (req, res) => {
    res.send('We are on home');
});

>>>>>>> 6bc7ee9aa98611a5c310939996174f95b84b7086
//Connection to database
// mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => 
//    console.log('Connected to database')
// );

mongoose.connect('mongodb+srv://kcg-admin:Mn51phLrce3uYPt4@kcg-cluster-t19p2.mongodb.net/agoraDB?retryWrites=true&w=majority', { useNewUrlParser: true }, () =>
    console.log('Connected to database')
);

const PORT = process.env.PORT || 8080;
app.listen(PORT);