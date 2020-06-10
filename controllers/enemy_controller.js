const express = require('express');
const router = express.Router();

router.get('/:level', (req, res) => {
    const level = req.params.level;
    const waves = [];
    let numWaves = parseInt(level) + 2;
    console.log(numWaves);
    const wave  = [];
    for(let i = 1; i <= numWaves; i++) {
        wave.push(Math.ceil(i / 2) + Math.floor(level / 3));
    }
    console.log(wave);
    res.send(wave);
});
module.exports = router;