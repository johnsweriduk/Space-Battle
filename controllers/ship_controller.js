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
    const firepower = req.body.damage;
    const hp = req.body.hp;
    if(firepower <= 1) {
        firepower = 1;
        hp = 9;
    } else if(hp <= 1) {
        hp = 1;
        firepower = 9;
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
        hp: hp * 20,
        damage: firepower,
        level: 1,
        highScore: 0,
        xp: 0
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
        } else {
            Ship.findOne({name: req.body.name}, (err, ship) => {
                const firepower = req.body.damage;
                const hp = req.body.hp;
                if(firepower <= 1) {
                    firepower = 1;
                    hp = 9;
                } else if(hp <= 1) {
                    hp = 1;
                    firepower = 9;
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
                ship.hp = hp;
                ship.damage = firepower;
                ship.save();
            })
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