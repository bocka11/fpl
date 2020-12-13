const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const average = new Schema({
    gameweek:String,
    average_points:Number
});

const model = mongoose.model('average',average,'average');

module.exports = model;