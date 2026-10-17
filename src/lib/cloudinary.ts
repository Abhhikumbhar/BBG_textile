import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import sharp from "sharp";

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
  // Compress and resize image using sharp to lightweight WebP (reduces 5MB to ~120KB)
  let optimizedBuffer = buffer;
  try {
    optimizedBuffer = await sharp(buffer)
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
  } catch (err) {
    console.warn("Image optimization fallback to original buffer:", err);
  }

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
      uploadStream.end(optimizedBuffer);
    });
  }

  // Fallback: If on Vercel/serverless and Cloudinary is not configured, return lightweight WebP data URI
  if (process.env.VERCEL) {
    try {
      const base64Data = optimizedBuffer.toString("base64");
      return {
        url: `data:image/webp;base64,${base64Data}`,
        publicId: `data_${Date.now()}`,
      };
    } catch (e) {
      console.error("Data URI creation failed:", e);
    }
  }

  // Fallback: Store locally in public/uploads/ as optimized .webp
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const cleanBase = path
      .basename(filename, path.extname(filename))
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .substring(0, 40);
    const uniqueName = `${cleanBase}_${Date.now()}.webp`;
    const filePath = path.join(uploadsDir, uniqueName);

    await fs.promises.writeFile(filePath, optimizedBuffer);

    return {
      url: `/uploads/${uniqueName}`,
      publicId: `local_${uniqueName}`,
    };
  } catch (fsErr) {
    console.warn("Local storage write failed, using WebP data URI fallback:", fsErr);
    const base64Data = optimizedBuffer.toString("base64");
    return {
      url: `data:image/webp;base64,${base64Data}`,
      publicId: `data_${Date.now()}`,
    };
  }

  // Fallback: Store locally in public/uploads/ if writable
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(filename) || ".webp";
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
  } catch (fsErr) {
    console.warn("Local storage unavailable (e.g. read-only serverless on Vercel), falling back to optimized data URI:", fsErr);
    // Determine mime type from filename or default to webp
    const ext = path.extname(filename).toLowerCase();
    const mime =
      ext === ".png"
        ? "image/png"
        : ext === ".svg"
        ? "image/svg+xml"
        : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";

    const base64Data = buffer.toString("base64");
    return {
      url: `data:${mime};base64,${base64Data}`,
      publicId: `data_${Date.now()}`,
    };
  }
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
