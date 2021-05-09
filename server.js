const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const location = require(path.join(__dirname, 'routes','api','location'));
const trigger = require(path.join(__dirname, 'routes','api','trigger'));
const feed = require(path.join(__dirname, 'routes','api','feed'));
const credit = require(path.join(__dirname, 'routes','api','credit'));
const app = express();

// middleware setup
app.use(bodyParser.json());     //usage of body parser
app.use(cors());                //allow cross origin reference
app.use(compression());         //compress all the route responses

// DB configuration
const url = require('./config/keys').mongoURI;
// database connection
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true})
    .then(()=> console.log("Connected to mongoDB"))
    .catch(err => console.log(err));

// Using the routes
app.use("/location", location);
app.use("/trigger", trigger);
app.use("/feed", feed);
app.use("/credit", credit);

// port for connection
const port = process.env.PORT || 5000;

// listen for connection
app.listen(port, () => console.log("Server started at "+port));

// setting up the default route other than location and trigger
app.get("*",(req,res)=>{
    res.json({"server": "DefenShe"})
})