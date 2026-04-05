import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import fs from "fs";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;

const safelyRemoveLocalFile = (localFilePath) => {
  if (localFilePath && fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
  }
};

async function getAuthenticatedUser(req) {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return null;
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    return user || null;
  } catch (error) {
    return null;
  }
}

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  let filter = {};

  if (query) {
    filter = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    };
  }

  if (userId && isValidObjectId(userId)) {
    filter.owner = userId;
  }

  const sortOrder = sortType === "asc" ? 1 : -1;
  const sortOptions = { [sortBy]: sortOrder };
  const totalVideos = await Video.countDocuments(filter);

  const videos = await Video.find(filter)
    .populate("owner", "fullName username email avatar")
    .sort(sortOptions)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean();

  const videoIds = videos.map((video) => video._id);
  const likeGroups = await Like.aggregate([
    {
      $match: {
        video: { $in: videoIds },
      },
    },
    {
      $group: {
        _id: "$video",
        likesCount: { $sum: 1 },
      },
    },
  ]);

  const likesMap = new Map(
    likeGroups.map((item) => [item._id.toString(), item.likesCount])
  );

  const enrichedVideos = videos.map((video) => ({
    ...video,
    likesCount: likesMap.get(video._id.toString()) || 0,
  }));

  const pagination = {
    totalVideos,
    currentPage: Number(page),
    totalPages: Math.ceil(totalVideos / Number(limit)),
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videos: enrichedVideos, pagination },
        "Videos fetched successfully"
      )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

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

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const uploadedVideo = req.files?.videoFile?.[0];
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Please provide the video file");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Please provide the thumbnail file");
  }

  if (uploadedVideo?.size > MAX_VIDEO_SIZE_BYTES) {
    safelyRemoveLocalFile(videoLocalPath);
    safelyRemoveLocalFile(thumbnailLocalPath);
    throw new ApiError(400, "Video size must be 100MB or less");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath, {
    resource_type: "video",
  });
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, {
    resource_type: "image",
  });

  if (!videoFile?.url) {
    throw new ApiError(
      500,
      "Video upload failed. Please try again with a supported video file."
    );
  }

  if (!thumbnail?.url) {
    throw new ApiError(
      500,
      "Thumbnail upload failed. Please try again with a supported image."
    );
  }

  const duration = Number.isFinite(videoFile.duration)
    ? Math.floor(videoFile.duration)
    : 0;

  const newVideo = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    isPublished: true,
    duration,
    owner: user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newVideo, "Video successfully uploaded"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId)
    .populate("owner", "fullName username email avatar coverImage")
    .lean();

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const likesCount = await Like.countDocuments({ video: videoId });

  res
    .status(200)
    .json(new ApiResponse(200, { ...video, likesCount }, "Video found"));
});

const incrementVideoViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $inc: { views: 1 },
    },
    { new: true }
  ).populate("owner", "fullName username email avatar");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const authenticatedUser = await getAuthenticatedUser(req);

  if (authenticatedUser?._id) {
    await User.findByIdAndUpdate(authenticatedUser._id, {
      $pull: { watchHistory: video._id },
    });

    await User.findByIdAndUpdate(authenticatedUser._id, {
      $push: { watchHistory: { $each: [video._id], $position: 0 } },
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video views updated"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const video = await Video.findById(videoId).populate("owner");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const userId = req.user._id.toString();

  if (video.owner._id.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

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

  const prevVideo = video.videoFile;
  const prevThumbnail = video.thumbnail;
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const uploadedVideo = req.files?.videoFile?.[0];
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  let videoFile = { url: video.videoFile };
  let thumbnail = { url: video.thumbnail };

  if (uploadedVideo?.size > MAX_VIDEO_SIZE_BYTES) {
    safelyRemoveLocalFile(videoLocalPath);
    safelyRemoveLocalFile(thumbnailLocalPath);
    throw new ApiError(400, "Video size must be 100MB or less");
  }

  if (videoLocalPath) {
    videoFile = await uploadOnCloudinary(videoLocalPath, {
      resource_type: "video",
    });

    if (!videoFile?.url) {
      throw new ApiError(500, "Failed to upload replacement video");
    }
  }

  if (thumbnailLocalPath) {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath, {
      resource_type: "image",
    });

    if (!thumbnail?.url) {
      throw new ApiError(500, "Failed to upload replacement thumbnail");
    }
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      title,
      description,
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
    },
    { new: true }
  );

  if (videoLocalPath && prevVideo) {
    await deleteFromCloudinary(prevVideo);
  }

  if (thumbnailLocalPath && prevThumbnail) {
    await deleteFromCloudinary(prevThumbnail);
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video successfully updated"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const userId = req.user._id.toString();

  if (video.owner.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  if (video.videoFile) {
    await deleteFromCloudinary(video.videoFile);
  }

  if (video.thumbnail) {
    await deleteFromCloudinary(video.thumbnail);
  }

  await Video.findByIdAndDelete(videoId);

  res.status(200).json(new ApiResponse(200, {}, "Video successfully deleted"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  incrementVideoViews,
  updateVideo,
  deleteVideo,
};
