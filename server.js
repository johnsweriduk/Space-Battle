// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');

// Configuration
require('dotenv').config();
const app = express();
const db = mongoose.connection;
const PORT = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;

app.use(
    session({
        secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
        resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
        saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
    })
);

// Middleware
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));

// Database
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {
    console.log('The connection with mongod is established')
});
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', mongoURI));
db.on('disconnected', () => console.log('mongo disconnected'));

// uncomment to wipe database
//db.dropDatabase(console.log('dropped'));

// Controllers
const shipController = require('./controllers/ship_controller.js');
app.use('/ship', shipController);

const enemyController = require('./controllers/enemy_controller.js');
app.use('/enemy', enemyController);

const userController = require('./controllers/user_controller.js');
app.use('/users', userController);

const sessionsController = require('./controllers/session_controller.js');
app.use('/sessions', sessionsController);

app.get('/', (req, res) => {
    res.render('index.ejs', {
        currentUser: req.session.currentUser
    });
});

// Listener
app.listen(PORT, () => {
    console.log('listening');
});