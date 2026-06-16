export const REAL_ESTATE_DEFAULT_IMAGE = "/real-estate/projects/palm-grove-villa.webp";

export const REAL_ESTATE_FALLBACK_IMAGES = [
  REAL_ESTATE_DEFAULT_IMAGE,
  "/real-estate/projects/gardenia-apartments.webp",
  "/real-estate/projects/skyline-residence.webp",
  "/real-estate/projects/emerald-heights.webp",
  "/real-estate/projects/verdant-villa-estate.webp",
  "/real-estate/projects/lakefront-residences.webp",
  "/real-estate/projects/hillcrest-villas.webp",
  "/real-estate/projects/urban-signature-tower.webp"
] as const;

export function getRealEstateImageSource(value: string | null | undefined) {
  const source = value?.trim();

  if (!source || source === "#" || source.startsWith("//")) return null;
  if (source.startsWith("javascript:") || source.startsWith("data:")) return null;

  return source.startsWith("/") ? source : null;
}

export function realEstateFallbackImage(index = 0) {
  return REAL_ESTATE_FALLBACK_IMAGES[index % REAL_ESTATE_FALLBACK_IMAGES.length];
}

export function normalizeRealEstateImage(value: string | null | undefined, fallback = REAL_ESTATE_DEFAULT_IMAGE) {
  return getRealEstateImageSource(value) || fallback;
}

export function fillRealEstateImageSet(
  images: Array<string | null | undefined>,
  minimum = 5,
  preferredFallback = REAL_ESTATE_DEFAULT_IMAGE
) {
  const seen = new Set<string>();
  const result: string[] = [];

  const add = (value: string | null | undefined) => {
    const source = getRealEstateImageSource(value);
    if (!source || seen.has(source)) return;
    seen.add(source);
    result.push(source);
  };

  add(preferredFallback);
  images.forEach(add);

  for (let index = 0; result.length < minimum; index += 1) {
    add(realEstateFallbackImage(index));
  }

  return result;
}
