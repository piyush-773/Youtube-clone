import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import cloudinary from "cloudinary";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Find the user by ID
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Validate title and description
  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new ApiError(400, "Please provide a valid title");
  }
  if (
    !description ||
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    throw new ApiError(400, "Please provide a valid description");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  // Validate video and thumbnail paths
  if (!videoLocalPath) {
    throw new ApiError(400, "Please provide the video file");
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Please provide the thumbnail file");
  }

  // Upload video and thumbnail to Cloudinary
  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const duration = Math.floor(videoFile.duration);

  // Create new video entry
  const newVideo = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    isPublished: true,
    duration,
    owner: user._id,
  });

  // Send response with newly created video
  res
    .status(201)
    .json(new ApiResponse(201, newVideo, "Video successfully uploaded"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
