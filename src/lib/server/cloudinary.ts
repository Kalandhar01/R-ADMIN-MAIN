import { createHash } from "node:crypto";

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

export async function uploadToCloudinary(
  file: Buffer,
  folder: string,
  fileName?: string
): Promise<{ url: string; publicId: string }> {
  if (!isCloudinaryConfigured || !apiKey || !apiSecret || !cloudName) {
    throw new Error("Cloudinary is not configured");
  }

  const timestamp = String(Math.floor(Date.now() / 1000));
  const baseName = fileName
    ? fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-")
    : `upload-${Date.now()}`;
  const publicId = `${folder}/${baseName}`;

  const params: Record<string, string> = {
    folder,
    public_id: publicId,
    resource_type: "auto",
    quality: "auto:best",
    fetch_format: "auto",
    timestamp,
  };

  const sig = signature(params, apiSecret);

  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(file)]), fileName || "upload");
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("resource_type", "auto");
  formData.append("quality", "auto:best");
  formData.append("fetch_format", "auto");
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey);
  formData.append("signature", sig);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `Cloudinary upload failed: ${res.status}`);
  }

  if (!data.secure_url) {
    throw new Error("Cloudinary did not return a secure URL");
  }

  return { url: data.secure_url, publicId: data.public_id || publicId };
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured || !apiKey || !apiSecret || !cloudName) {
    return false;
  }

  const timestamp = String(Math.floor(Date.now() / 1000));
  const params: Record<string, string> = { public_id: publicId, timestamp };
  const sig = signature(params, apiSecret);

  const body = new URLSearchParams();
  body.set("public_id", publicId);
  body.set("timestamp", timestamp);
  body.set("api_key", apiKey);
  body.set("signature", sig);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body }
  );

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `Cloudinary delete failed: ${res.status}`);
  }

  return data.result === "ok";
}

export function parsePublicIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "res.cloudinary.com") return null;
    const segments = u.pathname.split("/");
    const uploadIndex = segments.indexOf("upload");
    if (uploadIndex === -1 || uploadIndex + 1 >= segments.length) return null;
    return segments.slice(uploadIndex + 1).join("/").replace(/\.[^.]+$/, "");
  } catch {
    return null;
  }
}
