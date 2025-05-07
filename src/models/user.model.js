import mongoose from "mongoose";
import bcrypt from "bcrypt"; //Load hash from your password DB.
import Jsonwebtoken from "jsonwebtoken"; //(bearer token)authentication and secure data exchange in web applications and APIs.
const userSchema = new Schema(
  {
    //model
    id: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true, //seaching enabled , gives load , proper use
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary service url
      required: true,
    },
    coverimage: {
      type: String, //cloudinary service url
    },
    watchhistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    password: {
      type: String,
      required: [true, "Password Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// pre-hooks (middleware functions)  , run before the execution of certain operations(validation, logging,etc) on queries,returns a Schema object allow chaining
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password, 10);
  next();
});
//methods
userSchema.methods,
  (isPasswordCorrect = async (password) => {
    return await bcrypt.compare(password, this.password);
  });
//token generation
userSchema.methods.generateAccessToken = async () => {
  return Jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateAccessToken = async () => {
  return Jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
