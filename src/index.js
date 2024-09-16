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