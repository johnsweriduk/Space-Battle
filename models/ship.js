const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipSchema = Schema({
    name: String,
    hp: Number,
    damage: Number,
    experience: Number,
    level: Number,
    highScore: Number
});

const Ship = mongoose.model('Ship', shipSchema);

module.exports = Ship;