const express=require("express");
const app=express();
const dotenv=require("dotenv");
const cookieParser=require("cookie-parser");

dotenv.config();
const rideRouter=require('./routes/ride.routes');
const Mongoconnect=require("./config/mongoose-connection");

const rabbitMQ=require('./service/rabbit');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/",rideRouter);


Mongoconnect();
rabbitMQ.connect();
module.exports=app;