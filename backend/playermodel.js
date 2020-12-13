const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const PlayerData = new Schema({
    id:Number,
    name:String,
    team:String,
    points:[]
});

const PlayerModel = mongoose.model('player',PlayerData,'players');

module.exports = PlayerModel;
