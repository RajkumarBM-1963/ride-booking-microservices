const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const captainRouter = require('./routes/captain.routes');
const connectMongo = require("./config/mongoose-connection");
const rabbitMQ = require('./service/rabbit');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", captainRouter);
connectMongo();
rabbitMQ.connect();
// async function startApp() {
//     try {
//         await connectMongo();
//         await rabbitMQ.connect();
//         console.log("✅ MongoDB & RabbitMQ connected");
//     } catch (err) {
//         console.error("❌ Failed to connect:", err);
//         process.exit(1);
//     }
// }

// startApp();

module.exports = app;
