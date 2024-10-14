import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

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
  const video = await Video.findById(videoId).populate("owner");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  res.status(200).json(new ApiResponse(200, video, "Video found"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  // Find the video by its ID and populate the owner
  const video = await Video.findById(videoId).populate("owner");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const userId = req.user._id.toString();

  // Check if the user is authorized to update the video
  if (video.owner._id.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  // Validate title and description
  console.log(title)
  console.log(description)
  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new ApiError(400, "Please provide a valid title");
  }
  if (!description || typeof description !== "string" || description.trim() === "") {
    throw new ApiError(400, "Please provide a valid description");
  }

  // Extract previous Cloudinary public IDs for cleanup
  const prevVideo = video.videoFile;
  const prevThumbnail = video.thumbnail;

  // Get new video and thumbnail local paths if provided
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  // Upload new video and thumbnail to Cloudinary if provided
  let videoFile, thumbnail;

  if (videoLocalPath) {
    videoFile = await uploadOnCloudinary(videoLocalPath);
  } else {
    videoFile = { url: video.videoFile }; // Use previous video URL if no new file uploaded
  }

  if (thumbnailLocalPath) {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  } else {
    thumbnail = { url: video.thumbnail }; // Use previous thumbnail URL if no new file uploaded
  }

  // Update video details in the database
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      title,
      description,
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
    },
    { new: true } // Return the updated video
  );

  // Delete old video and thumbnail from Cloudinary if new files were uploaded
  if (videoLocalPath) {
    await deleteFromCloudinary(prevVideo); // Delete previous video
  }
  if (thumbnailLocalPath) {
    await deleteFromCloudinary(prevThumbnail); // Delete previous thumbnail
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video successfully updated"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Find the video by its ID
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the user is the owner of the video
  const userId = await req.user._id.toString();
  if (video.owner.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  const videoPublicId = video.videoFile;
  const thumbnailPublicId = video.thumbnail;

  // Delete video and thumbnail from Cloudinary
  await deleteFromCloudinary(videoPublicId); // Delete video
  await deleteFromCloudinary(thumbnailPublicId); // Delete thumbnail

  // Delete the video document from the database
  await Video.findByIdAndDelete(videoId);

  res.status(200).json(new ApiResponse(200, {}, "Video successfully deleted"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
};
