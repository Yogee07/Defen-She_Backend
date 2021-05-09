const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating a schema for triggerData table
const triggerSchema = new Schema({
    proxyID: { type: String, required: true},
    callerID: { type: String, required: true},
});

module.exports = mongoose.model('trigger', triggerSchema);