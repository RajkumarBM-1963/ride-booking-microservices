const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

dotenv.config(); // ✅ Load env vars first

const rabbitMQ = require("./service/rabbit");
const MongoConnect = require("./config/mongoose-connection");
const userRouter = require("./routes/user.routes");

const app = express();

// ✅ Middleware
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/", userRouter);

MongoConnect();
rabbitMQ.connect();

module.exports = app;
