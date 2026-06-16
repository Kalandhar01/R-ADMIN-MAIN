"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";
import { REAL_ESTATE_DEFAULT_IMAGE, normalizeRealEstateImage } from "@/lib/real-estate-images";

type RealEstateImageProps = Omit<ImageProps, "src"> & {
  src: string | null | undefined;
  fallbackSrc?: string;
};

export function RealEstateImage({ src, fallbackSrc = REAL_ESTATE_DEFAULT_IMAGE, onError, ...props }: RealEstateImageProps) {
  const fallback = useMemo(() => normalizeRealEstateImage(fallbackSrc, REAL_ESTATE_DEFAULT_IMAGE), [fallbackSrc]);
  const requestedSrc = useMemo(() => normalizeRealEstateImage(src, fallback), [fallback, src]);
  const [activeSrc, setActiveSrc] = useState(requestedSrc);

  useEffect(() => {
    setActiveSrc(requestedSrc);
  }, [requestedSrc]);

  return (
    <Image
      {...props}
      src={activeSrc}
      onError={(event) => {
        if (activeSrc !== fallback) setActiveSrc(fallback);
        onError?.(event);
      }}
    />
  );
}
