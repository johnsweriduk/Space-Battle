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
    Ship.find({}).sort({highScore: -1}).limit(10).exec( (err, ships) => {
        res.render('ships/leaderboard.ejs', {
            ships: ships
        });
    });
});

router.post('/', (req, res) => {
    const firepower = req.body.damage;
    const hp = req.body.hp;
    const createdShip = {
        name: req.body.name,
        hp: hp * 20,
        damage: firepower,
        level: 1,
        highScore: 0
    };
    console.log(createdShip);
    Ship.create(createdShip, (err, ship) => {
        console.log(ship);
    });
    Ship.find({name: req.body.username}, (err, ship) => {
       res.send(200);
    });
});

router.put('/', (req, res) => {
    console.log(req.body);
    Ship.findOne({name: req.body.name}, (err, ship) => {
        //ship = ship[0];
        if(req.body.score) {
            if(req.body.score > ship.highScore) {
                console.log('test');
                ship.highScore = req.body.score;
            }
        }
        if(ship.experience >= 10 * ship.level) {
            ship.experience -= ship.level * 10;
            ship.level++;
            ship.hp *= 1.1;
            ship.damage *= 1.1;
        }
        ship.save();
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