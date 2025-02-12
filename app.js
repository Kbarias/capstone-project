const express = require('express');
const app = express();
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash'); //to display message that user was successfully registered
const session = require('express-session');
const passport = require('passport');

require('dotenv/config');

//Passport config
require('./config/passport')(passport);

//Bodyparser
app.use(express.urlencoded({ extended: false }));

app.use(expressLayouts);
app.set('view engine', 'ejs');

//Express Session
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie:{
            expires: false
          }
    })
);
//for image folder
app.use(express.static(__dirname + '/views'));


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

const dashboardRoute = require('./routes/dashboard.js');
app.use('/dashboard', dashboardRoute);

const exchangeRoute = require('./routes/exchanges.js');
app.use('/exchange', exchangeRoute);

const placesRoute = require('./routes/places.js');
app.use('/places', placesRoute);

const gatherRoute = require('./routes/gather.js');
app.use('/gather', gatherRoute);



//Connection to database with hidden credentials
// mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => 
//    console.log('Connected to database')
// );

mongoose.connect('mongodb+srv://kcg-admin:Mn51phLrce3uYPt4@kcg-cluster-t19p2.mongodb.net/agoraDB?retryWrites=true&w=majority', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false}, () =>
    console.log('Connected to database')
);

const PORT = process.env.PORT || 3000;
app.listen(PORT);