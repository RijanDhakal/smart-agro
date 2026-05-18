"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "./.env",
});
cloudinary_1.v2.config({
    api_key: process.env.CLOUIDNARY_API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloud = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        const uploadResponse = await cloudinary_1.v2.uploader.upload(localFilePath, {
            resource_type: "image",
        });
        fs_1.default.unlinkSync(localFilePath);
        return uploadResponse;
    }
    catch (error) {
        fs_1.default.unlinkSync(localFilePath);
        console.log("error on cloudinary : ", error);
    }
};
exports.default = uploadOnCloud;
