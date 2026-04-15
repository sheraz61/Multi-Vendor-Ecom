import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const safeUnlink = (filePath) => {
    if (!filePath) return;
    fs.unlink(filePath, () => { });
};

export const uploadToCloudinary = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, { folder });
        safeUnlink(filePath);
        return {
            public_id: result.public_id,
            url: result.secure_url,
        };
    } catch (error) {
        safeUnlink(filePath);
        throw error;
    }
};

export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
};
