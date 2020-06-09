const express = require('express');
const router = express.Router();
const Ship = require('../models/ship.js');

router.get('/', (req, res) => {
    Ship.find({}, (err, ships) => {
        res.render('index.ejs', {
            ships: ships,
            currentUser: req.session.currentUser
        })
    });
});

router.get('/new-game', (req, res) => {
   res.render('new-game.ejs', {
       currentUser: req.session.currentUser
   })
});

router.get('/load-game', (req, res) => {
    res.render('load-game.ejs', {
        currentUser: req.session.currentUser
    })
});

router.post('/', (req, res) => {
    Ship.create(req.body);
});

router.put('/:shipName', (req, res) => {
    Ship.update({name: req.params.shipName}, {
        name: req.params.shipName,
        score: req.body.score
    });
});

router.delete('/:shipName', (req, res) => {
    Ship.find({name: req.params.shipName}, (err, ship) => {
        ship[0].remove();
        res.redirect('/');
    })
});

module.exports = router;