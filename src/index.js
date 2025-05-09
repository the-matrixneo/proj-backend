import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import connectDB from "./db/index.js";
configDotenv.config({
  path: "./env",
});
//application lvl error
app.on("error:", () => {
  console.log("Error has occured:", error);
  throw error;
});
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
