import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
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
export default app;
