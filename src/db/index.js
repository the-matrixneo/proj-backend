import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
  try {
    await mongoose.connect(`{process.env.DB_NAME}/${DB_NAME}`);
    console.log(
      "\n MongoDB connected  HOST:${connectionInstance.connection.host}"
    );
  } catch (error) {
    console.log("Connection failed", error);
    process.exit(1);
  }
};
export default connectDB;
