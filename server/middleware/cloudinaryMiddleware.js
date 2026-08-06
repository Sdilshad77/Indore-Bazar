import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root — works regardless of import order
dotenv.config({ path: resolve(__dirname, "../../.env") });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debug - server start hote hi ek baar print hoga
console.log("========== CLOUDINARY CONFIG ==========");
console.log("Cloud Name :", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key    :", process.env.CLOUDINARY_API_KEY);
console.log(
    "API Secret :",
    process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌"
);
console.log("======================================");

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    console.error("❌ Cloudinary Upload Error:", error);
                    return reject(error);
                }

                console.log("✅ Image Uploaded Successfully");
                resolve(result);
            }
        );

        stream.end(fileBuffer);
    });
};

export default uploadToCloudinary;