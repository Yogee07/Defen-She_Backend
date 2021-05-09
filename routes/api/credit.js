const express = require("express");
const router = express.Router();
const path = require('path');


const Credit = require(path.join(__dirname,'..','..', 'models','creditData'));

router.get('/:id',(req,res)=>{
    const deviceID = req.params.id;
    Credit.find({deviceID: deviceID})
    .then((object)=>{
        if(object.length>0){
            res.json({
                creditConnected: true,
                credit: object[0].credit
            })
        }else{
            res.json({
                creditConnected: false,
            })
        }
    })
    .catch((err)=>{
        res.json({
            creditConnected: false,
        })
    })
})

router.post('/',(req,res)=>{
    var deviceID = req.body.deviceID;
    var userName = req.body.name;
    var updateCredit = Number(req.body.credit);
    Credit.find({deviceID: deviceID})
    .then((object)=>{
        if(object.length>0){
            var creditRem = Number(object[0].credit);
            const query = { deviceID: deviceID };
            const update = { $set: { deviceID: deviceID, userName:userName, credit: creditRem+updateCredit}};
            const options = { upsert: true };
            Credit.updateOne(query, update, options)
            .then((doc)=>{
                res.sendStatus(200);
            })
            .catch((err)=>{
                res.sendStatus(400);
            })        
        }else{
            const query = { deviceID: deviceID };
            const update = { $set: { deviceID: deviceID, userName:userName, credit: 0}};
            const options = { upsert: true };
            Credit.updateOne(query, update, options)
            .then((doc)=>{
                res.sendStatus(200);
            })
            .catch((err)=>{
                res.sendStatus(400);
            })  
        }
    })
    .catch((err)=>{
        res.sendStatus(400);
    })
})
module.exports = router;