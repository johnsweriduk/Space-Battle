const express = require('express');
const router = express.Router();

router.get('/:level', (req, res) => {
    const level = req.params.level;
    const waves = [];
    let numWaves = 3;
    if(level > 5) {
        numWaves = 5;
        if(level > 8) {
            numWaves = 7;
        }
    }
    numwaves = 2 + level;
    const wave  = [];
    for(let i = 1; i <= numWaves; i++) {
        wave.push(Math.ceil(i / 2));
    }
    res.send(wave);
});
module.exports = router;