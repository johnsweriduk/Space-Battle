// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Configuration
require('dotenv').config();
const app = express();
const db = mongoose.connection;
const PORT = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;

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

// Routes
app.get('/', (req, res) => {
	res.send('Hello, world!');
});


// Listener
app.listen(PORT, () => {
    console.log('listening');
});