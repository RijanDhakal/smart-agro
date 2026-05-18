import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

cloudinary.config({
  api_key: process.env.CLOUIDNARY_API_KEY,
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloud = async (localFilePath: string) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });
    fs.unlinkSync(localFilePath);
    return uploadResponse;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("error on cloudinary : ", error);
  }
};

export default uploadOnCloud;
