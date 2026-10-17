import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest, recordAuditLog } from "@/lib/auth";
import { uploadImageBuffer, deleteImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const filesToUpload: File[] = [];
    if (singleFile) filesToUpload.push(singleFile);
    if (files && files.length > 0) {
      filesToUpload.push(...files);
    }

    if (filesToUpload.length === 0) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const uploaded = [];

    for (const file of filesToUpload) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // Check max size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 10MB limit` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await uploadImageBuffer(buffer, file.name, "bbg-textile/products");
      uploaded.push({
        url: result.url,
        publicId: result.publicId,
        name: file.name,
      });
    }

    await recordAuditLog({
      action: "IMAGE_UPLOAD",
      details: `Uploaded ${uploaded.length} image(s)`,
      adminUserId: admin.id,
    });

    return NextResponse.json({
      success: true,
      images: uploaded,
      // For single upload convenience
      url: uploaded[0]?.url,
      publicId: uploaded[0]?.publicId,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    await deleteImage(publicId);

    return NextResponse.json({ success: true, message: "Image removed" });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
