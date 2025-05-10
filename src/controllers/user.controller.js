import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler.js"; //helper file
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asynchandler(async (req, res) => {
  //details from frontend
  //validation - not empty
  //user alredy registered? : username/email
  // check avatar
  //upload on cloudinary , mullter : avatar
  // user object - mongodb : create entery
  //remove password and refresh token field from response
  //check user creation : return response / errror

  //json , form data -->
  const { fullName, email, id, password } = req.body;
  console.log("email:", email);
  //can also check with if-else
  // if (fullName === "") {
  //   throw new ApiError(400, "full name requied");
  // }
  if (
    [fullName, email, id, password].some((field) => field?.trim() === "") //A function that accepts up to three arguments,until the end of array return boolean value
  ) {
    throw new ApiError(400, "all fields required");
  }
  const existedUser = User.findOne({
    $or: [{ email }, { id }],
  });

  if (existedUser) {
    throw new ApiError(409, "email or id alredy exists ");
  }
  //files excess - mullter
  const avatarlocalpath = req.files?.avatar[0]?.path;
  const coverImagelocalpath = req.files?.coverImage[0]?.path;
  if (!avatarlocalpath) {
    throw new ApiError(400, "Avatar required");
  }
  const avatar = await uploadOnCloudinary(avatarlocalpath);

  const coverImage = await uploadOnCloudinary(coverImagelocalpath);
  if (!avatar) {
    throw new ApiError(400, "Avatar required"); //cc: avatar is compulsory else error
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", //cc: if avatar not uploaded let it be empty
    password,
    email,
    id: id.tolowerCse(),
  }); // things we dont want
  const createdUser = await User.findbyId(user.id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Successfully registered"));
});

export { registerUser };
