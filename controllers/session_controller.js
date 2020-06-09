const bcrypt = require('bcrypt');
const express = require('express');
const sessions = express.Router();
const User = require('../models/user.js');

sessions.get('/new', (req, res) => {
    if(req.session.counter == 0) {
        req.session.message = '';
    } else if(req.session.counter > 0) {
        req.session.counter--;
    }
    res.render('sessions/new.ejs', {
        message: req.session.message,
        currentUser: req.session.currentUser
    });
});

sessions.post('/', (req, res) => {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        // Database error
        if (err) {
            req.session.message = 'Database connection error';
            req.session.counter = 1;
            res.redirect('/sessions/new');
        } else if (!foundUser) {
            // if found user is undefined/null not found etc
            req.session.message = 'Username not found';
            req.session.counter = 1;
            res.redirect('/sessions/new');
        } else {
            // user is found yay!
            // now let's check if passwords match
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                // add the user to our session
                req.session.currentUser = foundUser;
                // redirect back to our home page
                req.session.message = '';
                req.session.counter = 0;
                res.redirect('/logs');
            } else {
                // passwords do not match
                req.session.message = 'Username/password combination does not match.';
                req.session.counter = 1;
                res.redirect('/sessions/new');
            }
        }
    })
});

sessions.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/logs')
    });
});

module.exports = sessions;