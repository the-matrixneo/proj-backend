import { v2 } from "cloudinary";
import fs from "fs"; //module allows you to work with the file system
//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//method use to upload file from local path
const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) return null;
    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
  } catch (error) {
    fs.unlinkSync(filepath); //removes the local file , upload fail
    return null;
  }
};

export { uploadOnCloudinary };
