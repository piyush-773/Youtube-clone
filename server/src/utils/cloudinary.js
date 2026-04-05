import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const CLOUDINARY_ROOT_FOLDER = "pk-hub";
const CLOUDINARY_IMAGE_FOLDER = `${CLOUDINARY_ROOT_FOLDER}/images`;
const CLOUDINARY_VIDEO_FOLDER = `${CLOUDINARY_ROOT_FOLDER}/videos`;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const safelyRemoveLocalFile = (localFilePath) => {
  if (localFilePath && fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
  }
};

const resolveFolder = (resourceType, providedFolder) => {
  if (providedFolder) {
    return providedFolder;
  }

  return resourceType === "video"
    ? CLOUDINARY_VIDEO_FOLDER
    : CLOUDINARY_IMAGE_FOLDER;
};

const extractCloudinaryAssetInfo = (assetUrl) => {
  if (!assetUrl || !assetUrl.includes("res.cloudinary.com")) {
    return null;
  }

  const uploadMarker = "/upload/";
  const uploadIndex = assetUrl.indexOf(uploadMarker);

  if (uploadIndex === -1) {
    return null;
  }

  const resourceType = assetUrl.includes("/video/upload/")
    ? "video"
    : assetUrl.includes("/image/upload/")
      ? "image"
      : null;

  if (!resourceType) {
    return null;
  }

  const assetPath = assetUrl
    .slice(uploadIndex + uploadMarker.length)
    .replace(/^v\d+\//, "")
    .split(/[?#]/)[0]
    .replace(/\.[^/.?#]+$/, "");

  return assetPath ? { publicId: assetPath, resourceType } : null;
};

const uploadLargeVideo = (localFilePath, options) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      localFilePath,
      {
        resource_type: "video",
        chunk_size: 6 * 1024 * 1024,
        timeout: 1200000,
        folder: resolveFolder("video", options.folder),
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );
  });

const uploadOnCloudinary = async (localFilePath, options = {}) => {
  try {
    if (!localFilePath) return null;

    const isVideoUpload = options.resource_type === "video";
    const folder = resolveFolder(options.resource_type, options.folder);

    const response = isVideoUpload
      ? await uploadLargeVideo(localFilePath, { ...options, folder })
      : await cloudinary.uploader.upload(localFilePath, {
          resource_type: "image",
          timeout: 600000,
          folder,
          ...options,
        });

    safelyRemoveLocalFile(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error?.message || error);
    safelyRemoveLocalFile(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (previousUrl) => {
  try {
    const assetInfo = extractCloudinaryAssetInfo(previousUrl);

    if (!assetInfo) {
      return;
    }

    await cloudinary.uploader.destroy(assetInfo.publicId, {
      resource_type: assetInfo.resourceType,
      invalidate: true,
    });
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
