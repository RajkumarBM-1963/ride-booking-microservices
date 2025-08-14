const authMiddleware=require('../middlewares/authMiddleware');
const rideController=require('../controller/ride.controller');
const express=require('express');
const router=express.Router();

router.post('/create-ride',authMiddleware.userAuth,rideController.createRide);
router.put('/accept-ride',authMiddleware.captainAuth,rideController.acceptRide);

module.exports=router;