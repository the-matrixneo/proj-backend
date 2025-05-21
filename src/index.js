import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import connectDB from "../src/db/index.js";
import { app } from "../src/app.js";
import "dotenv/config";

//db connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running at : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Connection failed", error);
  });
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
