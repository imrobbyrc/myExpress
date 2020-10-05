require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./api/users/user.router");
const guestRouter = require("./api/guests/guest.router");
const { checkToken } = require("./auth/token_validation");

app.use(express.json());

app.use("/api/users",checkToken,userRouter);
app.use("/api/guests",guestRouter);

const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log("Server up and running" , port);
});

