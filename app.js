const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//require('dotenv/config');

app.use(bodyParser.json());

//Import routes
const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

const placesRoute = require('./routes/places');
app.use('/places', placesRoute);


//ROUTES
app.get('/', (req, res) => {
    res.send('We are on home');
});

//Connection to database
// mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => 
//    console.log('Connected to database')
// );

mongoose.connect('mongodb+srv://kcg-admin:Mn51phLrce3uYPt4@kcg-cluster-t19p2.mongodb.net/agoraDB?retryWrites=true&w=majority', { useNewUrlParser: true }, () =>
    console.log('Connected to database')
);

app.listen(3000);