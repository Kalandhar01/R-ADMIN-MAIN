"use client";

import Image from "next/image";

export function FooterBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src="/footer-background.webp"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#080807]/20" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(224,197,121,0.56),transparent)]" />
    </div>
  );
}
