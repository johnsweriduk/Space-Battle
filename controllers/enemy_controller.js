const express = require('express');
const router = express.Router();

router.get('/:level', (req, res) => {
    const level = req.params.level;
    const waves = [];
    const numWaves = 3;
    if(level > 5) {
        numWaves = 5;
        if(level > 8) {
            numWaves = 7;
        }
    }
    for(let i = 0; i < numWaves; i++) {
        const wave  = [];

    }
});
module.exports = router;