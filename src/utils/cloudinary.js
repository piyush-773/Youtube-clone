import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteFromCloudinary = async (previousUrl) => {
  try {
    if (!previousUrl) {
      console.log("Nothing to delete.");
      return;
    }

    // Extract public_id from the previous URL
    const publicId = previousUrl.split("/").pop().split(".")[0]; // Extract the last part of the URL before the file extension
    
    // Determine resource type (image or video) based on the URL
    let resourceType;
    if (previousUrl.includes("/image/")) {
      resourceType = "image";
    } else if (previousUrl.includes("/video/")) {
      resourceType = "video";
    } else {
      console.error("Failed to determine resource type from URL.");
      return;
    }

    // console.log(`Extracted publicId: ${publicId}`);
    // console.log(`Resource type: ${resourceType}`);

    // Call Cloudinary to delete the resource
    const result = await cloudinary.api.delete_resources([publicId], {
      resource_type: resourceType, // Dynamically set the resource type
    });

    if (result.deleted[publicId] !== "deleted") {
      console.error("Failed to delete file from Cloudinary. Response:", result);
    } else {
      console.log("Successfully deleted file from Cloudinary.");
    }
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
