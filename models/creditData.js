const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating a schema for feedData table
const creditSchema = new Schema({
    deviceID:{ type: String, required: true},
    userName:{ type: String, required: true},
    credit: {type: Number, required: true}
},{ timestamps: true });

module.exports = mongoose.model('credit', creditSchema);