import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js"; //helper file
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { JsonWebTokenError } from "jsonwebtoken";
//login functionality
const generateAccessTokenandRefesehToken = async (UserId) => {
  try {
    //finding user
    const user = await User.findbyId(userId);
    //genrating token
    const accesstoken = user.generateAccessToken(); //methods so add ()
    const refreshtoken = user.generateRefreshToken();

    //adding value inside the object , token saved to database
    user.refreshtoken = refreshtoken;
    user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken }; //token generated
  } catch (error) {
    throw new ApiError(500, "Something went wrong ");
  }
};
const registerUser = asyncHandler(async (req, res) => {
  //details from frontend
  //validation - not empty
  //user alredy registered? : username/email
  // check avatar
  //upload on cloudinary , mullter : avatar
  // user object - mongodb : create entery
  //remove password and refresh token field from response
  //check user creation : return response / errror

  //json , form data -->
  const loginUser = asyncHandler(async (req, res) => {
    //req body -> data
    //email / usernmae
    //find user
    //access and refresh token password
    //send secure cookies
    const { email, id, password } = req.body;
    if (!id || !email) {
      // the ! sign outside bracket
      throw new ApiError(400, "Fill require field");
    }
    User.findOne({ $or: [{ id }, { email }] }); // find by any one method , operator in MongoDb
    if (!user) {
      //self made method user db insatnce
      throw new ApiError(404, "Please register");
    }
    const checkPassword = await user.isPasswordCorrect(password);
    if (!password) {
      //self made method user db insatnce
      throw new ApiError(401, "Invalid Password");
    }
    const { accesstoken, refreshtoken } =
      await generateAccessTokenandRefesehToken(user._id);

    //object update / database query(optional)
    const loggedInUser = User.findbyId(user._id).select(
      "-password -refreshtoken"
    );
    //cookie cannot be modified through frontend
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accesstoken", accesstoken, options)
      .cookie("refeshtoken", refreshtoken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accesstoken, //user wants to locally store cookies
            refreshtoken,
          },
          "User logged in successfully"
        )
      );
  });
  //logout
  const logoutUser = asyncHandler(async (req, res) => {
    await User.findbyIdAndUpdate(
      req.user._id,
      {
        //operator set
        $set: {
          refreshtoken: undefined,
        },
      },
      {
        new: true,
      }
    );
    //cookies
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "Logged out Successfully"));
  });
  const refreshAccessToken = asyncHandler(async (req, res) => {
    //refresh token -  access through cookies hit end pt
    const verfiyRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!verfiyRefreshToken) {
      throw new ApiError(400, "Not a valid token");
    }
    try {
      const decodedToken = jwt.verify(
        verfiyRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findbyId(decodedToken?._id);
      if (!user) {
        throw new ApiError(401, "Request cannot be accessed");
      }
      //matching of encoded token and verfiyRefreshToken
      if (verfiyRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "expired token");
      }
      //new token generation
      const options = {
        httpOnly: true,
        secure: true,
      };
      const { accessToken, refreshToken } =
        await generateAccessTokenandRefesehToken(user._id);
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accesstoken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken }));
    } catch (error) {
      throw new ApiError(400, error?.message || "Invalid Token");
    }
  });

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
  const existedUser = await User.findOne({
    $or: [{ email }, { id }],
  });

  if (existedUser) {
    throw new ApiError(409, "email or id alredy exists ");
  }
  //accessing uploaded files and images - multer
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
//changed password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  //validation of both password
  if (!(newPassword === confirmPassword)) {
    return res.status(400).json(new ApiError(400, "password not matched"));
  }
  const user = await User.findbyId(req.user?._id);
  const isPasswordCorrect = user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Password");
  }
  user.password = newPassword;
  //save this to run pre hook and hash it
  await user.save({ validateBeforeSave: false }); //database in another continent
  return res.status(200).json(new ApiResponse(200, {}, "password changed"));
  const currentUser = asyncHandler(async (req, res) => {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, req.user, "current user fetched"));
  });
});
// account details updated
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(400, " fill all required fields");
  }
  const user = await User.findbyIdAndUpdate(
    req.user?._id,
    {
      //mongodb operator
      $set: {
        fullname: fullname,
        email: email,
      },
    },
    { new: true }
  ).select("-password"); //password removed by select method
  return res.status(200).json(new ApiResponse(200, user, "Details Updated"));
});
// updated avatar
const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path; //single file to be uploaded

  if (!avatarLocalPath) {
    throw new ApiError(400, "No avatar uploaded");
  }
  // delete old image
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "error on  avatar uploading");
  }
  const user = await User.findbyIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url, // string url taken and getting avatr as obj
      },
    },
    {
      new: true,
    }
  ).select("-password");
  return res.status(200).json(new ApiResponse(200, user, "Avatar Updated"));
});
//coverimage updated
const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImagelocalpath = req.file?.path;
  if (!coverImagelocalpath) {
    throw new ApiError(400, "No Cover image uploaded");
  }
  const coverImage = await uploadOnCloudinary(coverImagelocalpath);
  if (!coverImage.url) {
    throw new ApiError(400, "error on uploading cover image");
  }
  const user = await User.findbyIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");
  return res.status(200).json(new ApiResponse(200, user, "Avatar Updated"));
});
//aggregation pipeline
const channelProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id?.trim) {
    throw new ApiError(401, "username not found");
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.tolowerCase(),
      },
    },
    {
      lookup: {
        from: "subscriptions", // lowercase and plural
        localField: "_id",
        foreginFiled: "channels",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreginFiled: "subscribers",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers", //field : to count
        },
        channelsCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        email: 1,
        coverImage: 1,
      },
    },
  ]);
  if (!channel?.length) {
    throw new ApiError(404, "does not exist");
  }
  return res.status(200).json(new ApiResponse(200, "success"));
  // aggregates return: sorted documents
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  currentUser,
  changeCurrentPassword,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  channelProfile,
};
