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

router.get('/leaderboard', (req, res) => {
    Ship.find({}, (err, ships) => {
        ships = ships.sort({highScore: -1}).limit(20);
        res.render('leaderboard.ejs', {
            ships: ships
        });
    });
});

router.post('/', (req, res) => {
    const firepower = req.body.firePower;
    const hp = req.body.hp;
    const ship = {
        name: req.body.username,
        hp: hp * 20,
        damage: firepower,
        level: 1,
        highScore: 0
    };
    Ship.create(ship);
    Ship.find({name: req.body.username}, (err, ship) => {
       res.send(ship._id);
    });
});

router.put('/', (req, res) => {
    console.log(req.body);
    Ship.find({name: req.body.name}, (err, ship) => {
        console.log(ship);
        console.log('test');
        //ship = ship[0];
        if(req.body.score) {
            if(req.body.score > ship.highScore) {
                ship.highScore = req.body.score;
            }
        }
        if(ship.experience >= 10 * ship.level) {
            ship.experience -= ship.level * 10;
            ship.level++;
            ship.hp *= 1.1;
            ship.damage *= 1.1;
            ship.save();
        }
    });
});

router.delete('/:shipId', (req, res) => {
    Ship.find({_id: req.params.shipId}, (err, ship) => {
        ship[0].remove();
        res.redirect('/');
    });
});



router.get('/edit/:shipId', (req, res) => {
    Ship.find({_id: req.params.shipId}, (err, ship) => {
        res.render('/users/edit.ejs', {
            ship: ship
        });
    });
});

module.exports = router;