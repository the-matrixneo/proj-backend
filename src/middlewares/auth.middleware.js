import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      //token from cookie || header
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    // check header , Authorization: Bearer <Token>
    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "No Access Given");
    }
    req.user = user; // added object , middleware and route handlers can access the authenticated user.
    next(); //pass to next middleware
  } catch (error) {
    throw new ApiError(401, "Invalid access");
  }
});
