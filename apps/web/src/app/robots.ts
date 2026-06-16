import type { MetadataRoute } from "next";
import { fallbackContent } from "@/data/fallbackContent";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = fallbackContent.seo.canonicalUrl || "https://ractysh.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
