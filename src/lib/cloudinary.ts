import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string,
  folder = "bbg-textile"
): Promise<{ url: string; publicId: string }> {
  // If Cloudinary is configured, upload to Cloudinary
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          format: "webp",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Failed to upload image to Cloudinary"));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Fallback: Store locally in public/uploads/ directory
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(filename) || ".jpg";
  const cleanBase = path
    .basename(filename, ext)
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .substring(0, 40);
  const uniqueName = `${cleanBase}_${Date.now()}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);

  await fs.promises.writeFile(filePath, buffer);

  return {
    url: `/uploads/${uniqueName}`,
    publicId: `local_${uniqueName}`,
  };
}

export async function deleteImage(publicId: string): Promise<boolean> {
  if (isCloudinaryConfigured && !publicId.startsWith("local_")) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (e) {
      console.error("Cloudinary deletion failed:", e);
      return false;
    }
  }

  if (publicId.startsWith("local_")) {
    const filename = publicId.replace("local_", "");
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    if (fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
        return true;
      } catch (e) {
        console.error("Local file deletion failed:", e);
      }
    }
  }

  return true;
}
