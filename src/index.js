// require('dotenv').config({path: './env'})
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})

connectDB()
.then( ()=> {
    app.on("error", (error) => {
        console.log("Error : ", error);
        throw err;
    });
    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch( (err)=> {
    console.error("Mongodb connection failed : ", err);
})
/*
const express = require("express");
const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Error : ", error);
      throw err;
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