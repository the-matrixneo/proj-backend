require("dotenv").config();

import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import connectDB from "./db/index";

connectDB();

// import express from "express";
// const app = express()(async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     app.on("error", () => {
//       console.log("ERROR:", error);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log("app is listening on ${process.env.PORT}");
//     });
//   } catch (error) {
//     console.log("ERROR:", error);
//   }
// })();
