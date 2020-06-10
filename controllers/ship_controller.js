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
router.get('/data/:shipName', (req, res) => {
   Ship.findOne({name: req.params.shipName}, (err, ship) => {
       res.send(ship);
   });
});
router.get('/leaderboard', (req, res) => {
    Ship.find({}).sort({highScore: -1}).limit(10).exec( (err, ships) => {
        res.render('ships/leaderboard.ejs', {
            ships: ships
        });
    });
});
router.get('/edit/:name', (req, res) => {
    Ship.findOne({name: req.params.name}, (err, ship) => {
       res.render('ships/edit.ejs', {
           ship: ship
       })
    });
});

router.post('/', (req, res) => {
    let firepower = req.body.damage;
    let hp = req.body.hp;
    if(firepower <= 1) {
        firepower = 0;
        hp = 8;
    } else if(hp <= 1) {
        hp = 0;
        firepower = 8;
    }
    if(firepower > 9) {
        firepower = 9;
        hp = 1;
    } else if(hp > 9) {
        hp = 9;
        firepower = 1;
    }
    while(firepower + hp > 10) {
        firepower--;
        if(firepower + hp > 10) {
            hp--;
        }
    }
    const createdShip = {
        name: req.body.name,
        hp: hp + 1,
        damage: firepower + 1,
        level: 1,
        highScore: 0,
        xp: 0
    };
    console.log(createdShip);
    Ship.create(createdShip, (err, ship) => {
        console.log(ship);
    });
    Ship.find({name: req.body.username}, (err, ship) => {
       res.sendStatus(200);
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
            console.log(ship.xp);
            ship.xp = parseInt(ship.xp) + parseInt(req.body.xp);
            console.log('level: ' + ship.level);
            console.log(ship.xp);
            console.log(req.body.xp);
            console.log('xp required: ' + Math.pow(ship.level, 2) * 10);
            while(ship.xp > 10 * Math.pow(ship.level, 2)) {
                ship.xp -= 10 * Math.pow(ship.level, 2);
                ship.level++;
            }
            ship.save();
            res.sendStatus(200);
        } else {
            Ship.findOne({name: req.body.name}, (err, ship) => {
                let firepower = req.body.shipfirepower;
                let hp = req.body.shiphull;
                if(firepower <= 1) {
                    firepower = 0;
                    hp = 8;
                } else if(hp <= 1) {
                    hp = 0;
                    firepower = 8;
                }
                if(firepower > 9) {
                    firepower = 9;
                    hp = 1;
                } else if(hp > 9) {
                    hp = 9;
                    firepower = 1;
                }
                while (firepower + hp > 10) {
                    firepower--;
                    if (firepower + hp > 10) {
                        hp--;
                    }
                }
                ship.hp = hp + 1;
                ship.damage = firepower + 1;
                ship.save();
                res.sendStatus(200);
            })
        }
    });
});

router.delete('/', (req, res) => {
    console.log(req.session.currentUser.username);
    Ship.findOne({name: req.session.currentUser.username}, (err, ship) => {
        ship.remove();
        res.sendStatus(200);
    });
});

module.exports = router;