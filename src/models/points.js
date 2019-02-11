const mongoose = require('mongoose');
const { Schema } = mongoose;

const pointsSchema = new Schema({
    idRoute: {type: String},
    user: {type: String},
    latitude: {type: String},
    longitude: {type: String},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Points', pointsSchema);
