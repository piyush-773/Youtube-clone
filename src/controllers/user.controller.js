import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - not empty
  //check if user is already exist
  //check for images and avatar
  //handle file
  //upload then cloudinary
  //create user object - create entry in db
  //remove refresh token and password from response
  //check for user creation
  //return res

  const { fullName, email, username, password } = req.body;
  console.log("email : ", email);

  if (
    [fullName, email, username, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existenceUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existenceUser) {
    throw new apiError(409, "User already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new apiError(400, "Avatar upload failed");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user ");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )
});

export { registerUser };
