import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// Regular expressions for strict validation
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/; // Alphanumeric and underscores, 3 to 30 chars
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Min 8 chars, upper, lower, number, special

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Validate that no field is empty
  if ([fullName, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Validate full name (allow letters and spaces only)
  if (!/^[a-zA-Z\s]+$/.test(fullName)) {
    throw new ApiError(400, "Full name should only contain letters and spaces");
  }

  // Validate email
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  // Validate username (only alphanumeric and underscores, no spaces, between 3-30 characters)
  if (!usernameRegex.test(username)) {
    throw new ApiError(
      400,
      "Username should be alphanumeric and between 3 and 30 characters"
    );
  }

  // Validate password (min 8 characters, at least one uppercase, one lowercase, one number, and one special character)
  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
    );
  }

  // Check if user already exists by username or email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // Check for file upload existence and validate
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;

  if (req.files?.coverImage?.length) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload avatar and cover image to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  // Create new user
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
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Return success response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Ensure email/username and password are provided
  if (!email && !username) {
    throw new ApiError(400, "Username or email is required.");
  }

  if (!password) {
    throw new ApiError(400, "Password is required.");
  }

  // Email/Username validation
  if (email && !emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  if (username && !usernameRegex.test(username)) {
    throw new ApiError(
      400,
      "Please provide a valid username (alphanumeric, 3-30 characters)."
    );
  }

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  //Validating password enter by user
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    " -password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in success"
      )
    );
  // return res.status(201).json(new ApiResponse(200, user, "User login success"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out success"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorise request !");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token !");
    }
  
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
  
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
  
    return res.status(200).cookie("accessToken", ac).cookie("refreshToken").json(
      new ApiResponse(
        200,
        {accessToken, refreshToken, newRefreshToken},
        "Access token refreshed"
      )
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
