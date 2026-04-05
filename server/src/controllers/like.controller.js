import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  let liked = false;

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
  } else {
    await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    liked = true;
  }

  const likesCount = await Like.countDocuments({ video: videoId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { liked, likesCount },
        liked ? "Video liked" : "Video unliked"
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  return res
    .status(501)
    .json(new ApiResponse(501, {}, "Comment likes are not implemented yet"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  return res
    .status(501)
    .json(new ApiResponse(501, {}, "Tweet likes are not implemented yet"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likes = await Like.find({ likedBy: req.user._id, video: { $ne: null } })
    .populate({
      path: "video",
      populate: {
        path: "owner",
        select: "fullName username email avatar",
      },
    })
    .sort({ createdAt: -1 });

  const videos = likes.map((like) => like.video).filter(Boolean);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Liked videos fetched successfully"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
