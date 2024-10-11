import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utlities/appError.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dvi6lv6oj",
  api_key: "394767352469232",
  api_secret: "Yf0VeWO-tbAJTbEln4Ywd5UGTGE",
});

const fileUpload = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`);
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    console.log("Field name:", file.fieldname);
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Only images are allowed", 401), false);
    }
  }

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
  });
  return upload;
};

export const uplaodSingleFile = (fieldName, folderName) => {
  return fileUpload(folderName).single(fieldName);
};

export const uplaodMixOfFiles = (arrayOfFields, folderName) => {
  return fileUpload(folderName).fields(arrayOfFields);
};

export const uploadToCloudinary = async (filePath, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });
    //fs.unlinkSync(filePath); 
    return result.secure_url; 
  } catch (error) {
    console.error("Upload to Cloudinary error:", error);
    throw new AppError("Error uploading to Cloudinary: " + error.message, 500);
  }
};
