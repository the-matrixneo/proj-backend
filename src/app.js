import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.on("error:", () => {
  console.log("Error has occured:", error);
  throw error();
});
//middleware
app.use(
  cors({
    Origin: process.env.CROS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(express.urlencoded()); //parses string , converts it into a js object (HTML forms)
app.use(express.static("public")); //enables the server to deliver files i.e html,images,pdf
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.route.js";

//routes declaration
app.use("/api/v1/users", userRouter);
// https://localhost/register
export { app };
