import Image, { type ImageProps } from "next/image";

export const RACTYSH_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTInIGhlaWdodD0nOCcgdmlld0JveD0nMCAwIDEyIDgnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGZpbHRlciBpZD0nYic+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMicgaGVpZ2h0PSc4JyBmaWxsPScjMTYwYjBkJy8+PHBhdGggZD0nTTAgOEw1IDBMNyA4WicgZmlsbD0nI2Q2YjQ1ZicgZmlsdGVyPSd1cmwoI2IpJyBvcGFjaXR5PScuNTUnLz48cGF0aCBkPSdNNSA4TDEyIDJWMkg1WicgZmlsbD0nI2ZmZjdlOCcgZmlsdGVyPSd1cmwoI2IpJyBvcGFjaXR5PScuMzUnLz48L3N2Zz4=";

export function OptimizedImage({
  alt,
  blurDataURL = RACTYSH_BLUR_DATA_URL,
  loading,
  placeholder = "blur",
  priority,
  sizes,
  ...props
}: ImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      blurDataURL={blurDataURL}
      loading={priority ? undefined : loading ?? "lazy"}
      placeholder={placeholder}
      priority={priority}
      sizes={sizes ?? "100vw"}
    />
  );
}
