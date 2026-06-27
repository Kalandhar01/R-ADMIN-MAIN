import { createHash } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

function signature(params: Record<string, string>, secret: string): string {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(`${serialized}${secret}`).digest("hex");
}

function derivePublicId(fileName: string | undefined, _folder: string): string {
  return fileName
    ? fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-")
    : `upload-${Date.now()}`;
}

async function uploadToCloudinaryApi(
  file: Buffer,
  folder: string,
  fileName?: string
): Promise<{ url: string; publicId: string }> {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const publicId = derivePublicId(fileName, folder);

  const params: Record<string, string> = {
    folder,
    public_id: publicId,
    timestamp,
  };

  const sig = signature(params, apiSecret!);

  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(file)]), fileName || "upload");
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("resource_type", "auto");
  formData.append("quality", "auto:best");
  formData.append("fetch_format", "auto");
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey!);
  formData.append("signature", sig);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: "POST", body: formData, signal: controller.signal }
    );
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || `Cloudinary upload failed: ${res.status}`);
    }
    if (!data.secure_url) {
      throw new Error("Cloudinary did not return a secure URL");
    }
    return { url: data.secure_url, publicId: data.public_id || publicId };
  } finally {
    clearTimeout(timeout);
  }
}

async function uploadLocally(
  file: Buffer,
  folder: string,
  fileName?: string
): Promise<{ url: string; publicId: string }> {
  const ext = fileName ? path.extname(fileName).toLowerCase() || ".bin" : ".bin";
  const baseName = fileName
    ? path.basename(fileName, ext).replace(/[^a-zA-Z0-9-]/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "file"
    : `upload-${Date.now()}`;
  const safeName = `${Date.now()}-${baseName}${ext}`;

  const relativeDir = folder.replace(/^\/+|\/+$/g, "");
  const uploadDir = path.join(process.cwd(), "public", "uploads", relativeDir);
  const uploadPath = path.join(uploadDir, safeName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, file);

  return {
    url: `/uploads/${relativeDir}/${safeName}`,
    publicId: `${relativeDir}/${safeName}`,
  };
}

export async function uploadToCloudinary(
  file: Buffer,
  folder: string,
  fileName?: string
): Promise<{ url: string; publicId: string }> {
  if (!isCloudinaryConfigured || !apiKey || !apiSecret || !cloudName) {
    return uploadLocally(file, folder, fileName);
  }

  try {
    return await uploadToCloudinaryApi(file, folder, fileName);
  } catch {
    return uploadLocally(file, folder, fileName);
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured || !apiKey || !apiSecret || !cloudName) {
    const localPath = path.join(process.cwd(), "public", publicId);
    try {
      await unlink(localPath);
      return true;
    } catch {
      return false;
    }
  }

  const timestamp = String(Math.floor(Date.now() / 1000));
  const params: Record<string, string> = { public_id: publicId, timestamp };
  const sig = signature(params, apiSecret);

  const body = new URLSearchParams();
  body.set("public_id", publicId);
  body.set("timestamp", timestamp);
  body.set("api_key", apiKey);
  body.set("signature", sig);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body }
    );
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || `Cloudinary delete failed: ${res.status}`);
    }
    return data.result === "ok";
  } catch {
    const localPath = path.join(process.cwd(), "public", publicId);
    try {
      await unlink(localPath);
      return true;
    } catch {
      return false;
    }
  }
}

export function parsePublicIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "res.cloudinary.com") {
      if (u.pathname.startsWith("/uploads/")) {
        return u.pathname.replace("/uploads/", "");
      }
      return null;
    }
    const segments = u.pathname.split("/");
    const uploadIndex = segments.indexOf("upload");
    if (uploadIndex === -1 || uploadIndex + 1 >= segments.length) return null;
    return segments.slice(uploadIndex + 1).join("/").replace(/\.[^.]+$/, "");
  } catch {
    return null;
  }
}
