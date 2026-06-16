import Image from "next/image";
import { cn } from "@/lib/utils";

const logoSrc = "/brand/ractysh-logo.png";

const logoSizes = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
  nav: "h-11 w-11 sm:h-12 sm:w-12",
  navCompact: "h-10 w-10",
  footer: "h-20 w-20 md:h-24 md:w-24",
  loader: "h-24 w-24 sm:h-28 sm:w-28",
  identity: "h-16 w-16 md:h-[4.5rem] md:w-[4.5rem]"
} as const;

const renderedSizes = {
  xs: "32px",
  sm: "40px",
  md: "48px",
  lg: "64px",
  xl: "96px",
  nav: "(min-width: 640px) 48px, 44px",
  navCompact: "40px",
  footer: "(min-width: 768px) 96px, 80px",
  loader: "(min-width: 640px) 112px, 96px",
  identity: "(min-width: 768px) 72px, 64px"
} as const;

interface BrandLogoProps {
  alt?: string;
  className?: string;
  decorative?: boolean;
  imageClassName?: string;
  priority?: boolean;
  size?: keyof typeof logoSizes;
}

export function BrandLogo({
  alt = "Ractysh logo",
  className,
  decorative = false,
  imageClassName,
  priority = false,
  size = "md"
}: BrandLogoProps) {
  return (
    <span
      aria-hidden={decorative ? true : undefined}
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-visible", logoSizes[size], className)}
    >
      <Image
        src={logoSrc}
        alt={decorative ? "" : alt}
        fill
        priority={priority}
        sizes={renderedSizes[size]}
        className={cn("object-contain", imageClassName)}
      />
    </span>
  );
}
