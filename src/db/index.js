import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // connection string and database name
    await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`); // env are used to keep sensitive information out of codebase
    console.log("Connected");
  } catch (error) {
    console.log("Connection failed:", error);
    process.exit(1); //terminate the Node.js process with a failure cod
  }
};
export default connectDB;
