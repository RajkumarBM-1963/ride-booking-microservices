const router=require("express").Router();
const {register,login,logout,profile,acceptedRide}=require("../controller/user.controller");
const isLoggedin=require("../middlewares/authMiddleware");

router.post("/register",register);
router.post("/login",login);
router.get("/logout",logout);
router.get("/profile",isLoggedin,profile);
router.get("/accepted-ride",acceptedRide);
module.exports=router;