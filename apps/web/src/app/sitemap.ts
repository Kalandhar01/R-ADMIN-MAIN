import type { MetadataRoute } from "next";
import { commercialServiceRoutes } from "@/data/commercialServices";
import { servicePageRoutes } from "@/data/servicePages";
import { getSiteContent } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const baseUrl = content.seo.canonicalUrl || "https://ractysh.com";
  const staticRoutes = [
    "",
    "/about",
    "/founder",
    "/directors",
    "/services",
    "/our-projects",
    "/business",
    "/ractysh-import-export",
    "/architecture",
    "/construction",
    "/real-estate",
    "/infrastructure",
    "/otc-exchange",
    "/careers",
    "/blog",
    "/contact",
    "/book-consultation",
    "/privacy-policy",
    "/terms-and-conditions",
    "/disclosure",
    "/copyright-policy",
    "/sitemap",
    "/trademark-certification"
  ];
  const routes = Array.from(new Set([...staticRoutes, ...commercialServiceRoutes, ...servicePageRoutes]));

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(content.updatedAt),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.78
  }));
}
