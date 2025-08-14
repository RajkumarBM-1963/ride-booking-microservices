const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const rideModel=require('../models/ride.Model');
const {subscribeToQueue,publishToQueue}=require('../service/rabbit');

module.exports.createRide=async(req,res)=>{
  try{
    const {pickup,destination}=req.body;
    const user=req.user;
    const ride=await rideModel.create({pickup,destination,user:user._id});
    publishToQueue("new-ride",JSON.stringify(ride));
    res.json({message:"Ride created successfully",ride});
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({message:"Internal server error"});
  }
}

module.exports.acceptRide=async(req,res)=>{
  try{
    const {rideId}=req.query;
    const ride= await rideModel.findById({_id:rideId});
    if(!ride){
      res.status(401).json({message:"Ride not found"});
    }
    ride.status="accepted";
    ride.captain=req.captain._id;
    await ride.save();
    res.json({message:"Ride accepted successfully",ride});
    publishToQueue("ride-accepted",JSON.stringify(ride));
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({message:"Internal server error"});
  }
  }