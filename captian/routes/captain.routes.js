const router=require("express").Router();
const {register,login,logout,profile,toggleAvailability,waitForNewRide}=require("../controller/captain.controller");
const authMiddleware=require("../middlewares/authMiddleware");

router.post("/register",register);
router.post("/login",login);
router.get("/logout",logout);
router.get("/profile",authMiddleware,profile);
router.patch("/toggleAvailability",authMiddleware,toggleAvailability);
router.get("/new-ride",authMiddleware,waitForNewRide);
module.exports=router;
