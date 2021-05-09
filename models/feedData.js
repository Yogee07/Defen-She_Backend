const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating a schema for feedData table
const feedSchema = new Schema({
    title:{ type: String, required: true},
    source:{ type: String, required: true},
    imageUri:{ type: String, required: false},
    url:{ type: String, required: false},
    date:{ type: Date, required: false},
},{ timestamps: true });

module.exports = mongoose.model('feed', feedSchema);