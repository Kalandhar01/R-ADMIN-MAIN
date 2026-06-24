import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/server/cloudinary";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  if (!isCloudinaryConfigured) {
    return NextResponse.json({ success: false, message: "Cloudinary is not configured." }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "ractysh-admin";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, folder, file.name);

    return NextResponse.json({ success: true, url: result.url, publicId: result.publicId });
  } catch (error) {
    console.error("[admin-upload]", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 }
    );
  }
}
