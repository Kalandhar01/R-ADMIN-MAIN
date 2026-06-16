import type { MetadataRoute } from "next";

const siteUrl = "https://architecture.ractysh.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/industrial-design`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.72
    }
  ];
}
