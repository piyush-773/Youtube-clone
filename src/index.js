// require('dotenv').config({path: './env'})
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./env"
})

connectDB()
/*
const express = require("express");
const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Error : ", error);
      throw error;
    });
    app.Listen(process.env.PORT, ()=>{
        console.log(`App is running on port ${process.env.PORT}`);
    })
  } catch (error) {
    console.log(error);
    throw err;
  }
})();
*/