import ApiError from "../utils/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler.js"; //helper file
import { User } from "../models/user.model.js";
const registerUser = asynchandler(async (req, res) => {
  //details from frontend
  //validation - not empty
  //user alredy registered? : username/email
  // check avatar
  //upload on cloudinary , mullter : avatar
  // user object - mongodb : create entery
  //remove password and refresh token field from response
  //check user creation : return response / errror
});
//json , form data -->
const { fullName, email, id, password } = req.body;
console.log("email:", email);
//can also check with if-else
// if (fullName === "") {
//   throw new ApiError(400, "full name requied");
// }
if (
  [fullName, email, username, password].some((field) => field?.trim() === "")
) {
  throw new ApiError(400, "all fields required");
}

export default registerUser;
