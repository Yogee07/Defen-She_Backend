const express = require("express");
const router = express.Router();
const path = require('path');
const fetch = require('node-fetch')
const Location = require(path.join(__dirname,'..','..', 'models','locationData'));
const Trigger = require(path.join(__dirname,'..','..', 'models','triggerData'));
const Credit = require(path.join(__dirname,'..','..', 'models','creditData'));

async function sendNotification(token){
    const message = {
        to: token,
        sound: 'default',
        title: 'Alert, there is an emergency around you',
        body: 'Your presence might help someone, care to help?',
      };
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      })
}
router.get('/:id',(req,res)=>{
    const proxyID = req.params.id;
    Trigger.find({proxyID: proxyID})
    .then((object)=>{
        if(object){
            Location.find({deviceID: object[0].callerID})
            .then((obj)=>{
                res.json({
                    render: true,
                    latitude: obj[0].latitude,
                    longitude: obj[0].longitude,
                })
            })
            .catch((err)=>{
                res.json({
                    render: false,
                })
            })
        }else{
            res.json({
                render: false,
            })
        }
        
    })
    .catch((err)=>{
        res.json({
            render: false,
        })
    })
})

router.post('/',(req,res)=>{
    const callerID = req.body.deviceID;
    const lat1 = parseFloat(req.body.latitude)+0.093; // 0.003
    const lat2 = parseFloat(req.body.latitude)-0.093;
    const lon1 = parseFloat(req.body.longitude)+0.093;
    const lon2 = parseFloat(req.body.longitude)-0.093;
    Location.find({latitude: { $lte: lat1, $gte: lat2 }, longitude: { $lte: lon1, $gte: lon2 }})
    .then((arr)=>{
        arr.forEach((proxy)=>{
            const triggerObj = new Trigger({
                proxyID: proxy.deviceID,
                callerID: callerID,
            })
            if(proxy.deviceID!==callerID){
                sendNotification(proxy.deviceID);
                triggerObj.save();
            }
        })
        res.sendStatus(200);
    })
    .catch((err)=>{
        res.sendStatus(500);
    })   
})

router.delete('/',(req,res)=>{
    const callerID = req.body.deviceID;
    var arr=[];
    Trigger.find({callerID: callerID})
    .then((result)=>{
        result.forEach((object)=>{
            Credit.find({deviceID: object.proxyID})
            .then((obj)=>{  
                if(obj.length>0){
                    arr.push({deviceID: obj[0].deviceID, name: obj[0].userName});
                }
            })
        })
        Trigger.deleteMany({callerID: callerID})
        .then((doc)=>{
            res.json(arr);
        })
        .catch((err)=>{
            res.json(arr);
        })
    })
    .catch((err)=>{
        Trigger.deleteMany({callerID: callerID})
        .then((doc)=>{
            res.json(arr);
        })
        .catch((err)=>{
            res.json(arr);
        })
    })
})

router.get('*',(req,res) =>{
    res.status(404).json({message: "Route not found"})
})

router.post('*',(req,res) =>{
    res.status(404).json({message: "Route not found"})
})

module.exports = router;