import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const projectRoot = path.resolve(new URL("..", import.meta.url).pathname);

const webpSize = { width: 1920, height: 1280 };
const avifSize = { width: 2560, height: 1440 };

const palettes = {
  architecture: { ink: "#17110d", base: "#f6efe4", mid: "#8a7146", gold: "#d6b45f", red: "#8b1118", mist: "#fff8ec" },
  construction: { ink: "#111111", base: "#f0e4d1", mid: "#6f665b", gold: "#c89d52", red: "#9d1c22", mist: "#fff6e5" },
  realEstate: { ink: "#182019", base: "#eef2e6", mid: "#62715e", gold: "#caa85d", red: "#7d1a21", mist: "#fffaf0" },
  trade: { ink: "#10171d", base: "#e8f1f4", mid: "#435d6a", gold: "#d2a84d", red: "#8f1720", mist: "#f6fbff" },
  careers: { ink: "#181512", base: "#f4eadc", mid: "#735f48", gold: "#d7b768", red: "#8b1118", mist: "#fff8ed" },
  blog: { ink: "#1b1515", base: "#f7eee5", mid: "#7d6754", gold: "#d5af5d", red: "#8b1118", mist: "#fffaf2" },
  founder: { ink: "#14110f", base: "#f3eadc", mid: "#6e5740", gold: "#d7b76c", red: "#7d1218", mist: "#fff7e8" },
  contact: { ink: "#111416", base: "#edf0ed", mid: "#56625f", gold: "#ceb163", red: "#8b1118", mist: "#fff9ec" },
  admin: { ink: "#080808", base: "#eeeeea", mid: "#3c3c3c", gold: "#c7a15a", red: "#b71c24", mist: "#f5f5f5" },
  home: { ink: "#15100d", base: "#f3eadc", mid: "#6d5c49", gold: "#d6b45f", red: "#8b1118", mist: "#fff7e8" },
  industrial: { ink: "#17130f", base: "#efe7d5", mid: "#5f684f", gold: "#d2b15c", red: "#8b1118", mist: "#fff9ec" },
  infrastructure: { ink: "#101214", base: "#e9ece8", mid: "#535f63", gold: "#d0ae5f", red: "#8b1118", mist: "#fff8ea" }
};

const assets = [
  ["apps/web/public/images/home/navbar-ecosystem-enterprise-grid-01.webp", "home", "ecosystem"],
  ["apps/web/public/images/home/navbar-our-work-project-index-01.webp", "home", "portfolio"],
  ["apps/web/public/images/home/navbar-services-command-suite-01.webp", "home", "services"],
  ["apps/web/public/images/home/navbar-about-leadership-lounge-01.webp", "founder", "founder"],
  ["apps/web/public/images/home/navbar-careers-collaboration-studio-01.webp", "careers", "careers"],
  ["apps/web/public/images/home/navbar-blog-editorial-desk-01.webp", "blog", "blog"],
  ["apps/web/public/images/home/navbar-contact-private-briefing-01.webp", "contact", "contact"],
  ["apps/web/public/images/home/navbar-founder-executive-vision-01.webp", "founder", "founder"],

  ["apps/web/public/images/architecture/home-service-architecture-model-01.webp", "architecture", "architecture"],
  ["apps/web/public/images/construction/home-service-construction-control-01.webp", "construction", "construction"],
  ["apps/web/public/images/real-estate/home-service-real-estate-residence-01.webp", "realEstate", "realEstate"],
  ["apps/web/public/images/import-export/home-service-global-trade-lanes-01.webp", "trade", "trade"],

  ["apps/web/public/images/construction/our-work-commercial-complex-site-01.webp", "construction", "construction"],
  ["apps/web/public/images/construction/our-work-commercial-complex-structure-02.webp", "construction", "construction"],
  ["apps/web/public/images/construction/our-work-commercial-complex-handover-03.webp", "construction", "construction"],
  ["apps/web/public/images/architecture/our-work-luxury-villa-interior-01.webp", "architecture", "architecture"],
  ["apps/web/public/images/architecture/our-work-luxury-villa-material-board-02.webp", "architecture", "interior"],
  ["apps/web/public/images/architecture/our-work-luxury-villa-evening-court-03.webp", "architecture", "architecture"],
  ["apps/web/public/images/real-estate/our-work-launch-residence-facade-01.webp", "realEstate", "realEstate"],
  ["apps/web/public/images/real-estate/our-work-launch-residence-lobby-02.webp", "realEstate", "realEstate"],
  ["apps/web/public/images/real-estate/our-work-launch-residence-sales-suite-03.webp", "realEstate", "services"],
  ["apps/web/public/images/architecture/our-work-corporate-office-atrium-01.webp", "architecture", "interior"],
  ["apps/web/public/images/architecture/our-work-corporate-office-boardroom-02.webp", "architecture", "services"],
  ["apps/web/public/images/architecture/our-work-corporate-office-facade-03.webp", "architecture", "architecture"],
  ["apps/web/public/images/import-export/our-work-export-import-hub-terminal-01.webp", "trade", "trade"],
  ["apps/web/public/images/import-export/our-work-export-import-hub-warehouse-02.webp", "trade", "construction"],
  ["apps/web/public/images/import-export/our-work-export-import-hub-route-map-03.webp", "trade", "ecosystem"],

  ["apps/web/public/images/architecture/who-we-are-architecture-tower-01.webp", "architecture", "architecture"],
  ["apps/web/public/images/construction/who-we-are-construction-grid-01.webp", "construction", "construction"],
  ["apps/web/public/images/real-estate/who-we-are-real-estate-frontage-01.webp", "realEstate", "realEstate"],
  ["apps/web/public/images/import-export/who-we-are-global-trade-port-01.webp", "trade", "trade"],

  ["apps/web/public/images/import-export/ecosystem-expansion-global-route-grid-01.webp", "trade", "ecosystem"],
  ["apps/web/public/images/architecture/ecosystem-expansion-spatial-blueprint-01.webp", "architecture", "ecosystem"],
  ["apps/web/public/images/infrastructure/ecosystem-expansion-infrastructure-command-01.webp", "infrastructure", "construction"],

  ["apps/web/public/images/careers/careers-operational-precision-room-01.webp", "careers", "services"],
  ["apps/web/public/images/careers/careers-creative-intelligence-studio-01.webp", "careers", "interior"],
  ["apps/web/public/images/careers/careers-enterprise-collaboration-hub-01.webp", "careers", "careers"],
  ["apps/web/public/images/careers/careers-execution-standards-room-01.webp", "careers", "portfolio"],
  ["apps/web/public/images/careers/careers-modern-workplace-culture-01.webp", "careers", "careers"],

  ["apps/web/public/images/blogs/blog-editorial-hero-enterprise-desk-01.webp", "blog", "blog"],
  ["apps/web/public/images/blogs/blog-accountable-construction-system-07.webp", "construction", "blog"],
  ["apps/web/public/images/blogs/blog-design-intelligence-studio-08.webp", "architecture", "blog"],
  ["apps/web/public/images/blogs/blog-international-commerce-workflow-09.webp", "trade", "blog"],
  ...Array.from({ length: 10 }, (_, index) => [
    `apps/web/public/images/blogs/blog-local-cover-fallback-${String(index + 1).padStart(2, "0")}.webp`,
    ["trade", "architecture", "construction", "home", "careers", "realEstate", "infrastructure", "blog", "contact", "home"][index],
    "blog"
  ]),

  ["apps/web/public/images/industrial-design/landscape-planning-showcase-garden-court-01.webp", "industrial", "landscape"],
  ["apps/web/public/images/home/home-og-enterprise-ecosystem-01.avif", "home", "ecosystem"],
  ["apps/web/public/images/founder/founder-profile-studio-01.webp", "founder", "founder"],
  ["apps/web/public/images/founder/founder-hero-executive-suite-01.avif", "founder", "founder"],
  ["apps/web/public/images/founder/founder-gallery-enterprise-map-01.webp", "founder", "ecosystem"],
  ["apps/web/public/images/founder/founder-gallery-architecture-desk-02.webp", "founder", "architecture"],
  ["apps/web/public/images/founder/founder-gallery-global-office-03.webp", "founder", "trade"],
  ["apps/web/public/images/founder/director-construction-delivery-01.webp", "construction", "founder"],
  ["apps/web/public/images/founder/director-design-studio-02.webp", "architecture", "founder"],
  ["apps/web/public/images/founder/director-enterprise-operations-03.webp", "home", "founder"],
  ["apps/web/public/images/architecture/business-division-architecture-studio-01.webp", "architecture", "architecture"],
  ["apps/web/public/images/construction/business-division-construction-site-01.webp", "construction", "construction"],
  ["apps/web/public/images/real-estate/business-division-real-estate-asset-01.webp", "realEstate", "realEstate"],
  ["apps/web/public/images/import-export/business-division-global-trade-01.webp", "trade", "trade"],
  ["apps/web/public/images/admin/trademark-certificate-preview-01.webp", "admin", "services"],
  ["apps/web/public/images/home/fallback-page-business-ecosystem-01.webp", "home", "ecosystem"],
  ["apps/web/public/images/home/fallback-page-services-command-01.webp", "home", "services"],

  ["apps/web/public/images/architecture/about-division-architecture-courtyard-01.webp", "architecture", "architecture"],
  ["apps/web/public/images/construction/about-division-construction-framework-01.webp", "construction", "construction"],
  ["apps/web/public/images/real-estate/about-division-real-estate-lobby-01.webp", "realEstate", "realEstate"],
  ["apps/web/public/images/import-export/about-division-trade-terminal-01.webp", "trade", "trade"],

  ["Import-Export-site/public/images/import-export/trade-network-governance-01.webp", "trade", "ecosystem"],
  ["Import-Export-site/public/images/import-export/executive-trade-desk-01.webp", "trade", "services"]
].map(([file, palette, motif]) => ({ file, palette, motif }));

const globalReplacements = new Map([
  ["/images/home/navbar-photo-1486406146926-c627a92ad1ab-01.webp", "/images/home/navbar-ecosystem-enterprise-grid-01.webp"],
  ["/images/home/navbar-photo-1518005020951-eccb494ad742-02.webp", "/images/home/navbar-our-work-project-index-01.webp"],
  ["/images/home/navbar-photo-1497366754035-f200968a6e72-03.webp", "/images/home/navbar-services-command-suite-01.webp"],
  ["/images/home/navbar-photo-1518005020951-eccb494ad742-04.webp", "/images/home/navbar-about-leadership-lounge-01.webp"],
  ["/images/home/navbar-photo-1551836022-d5d88e9218df-05.webp", "/images/home/navbar-careers-collaboration-studio-01.webp"],
  ["/images/home/navbar-photo-1450101499163-c8848c66ca85-06.webp", "/images/home/navbar-blog-editorial-desk-01.webp"],
  ["/images/home/navbar-photo-1497366412874-3415097a27e7-07.webp", "/images/home/navbar-contact-private-briefing-01.webp"],
  ["/images/home/navbar-photo-1518005020951-eccb494ad742-08.webp", "/images/home/navbar-founder-executive-vision-01.webp"],

  ["/images/home/home-services-section-photo-1600585154340-be6161a56a0c-01.webp", "/images/architecture/home-service-architecture-model-01.webp"],
  ["/images/home/home-services-section-photo-1541888946425-d81bb19240f5-02.webp", "/images/construction/home-service-construction-control-01.webp"],
  ["/images/home/home-services-section-photo-1486406146926-c627a92ad1ab-03.webp", "/images/real-estate/home-service-real-estate-residence-01.webp"],
  ["/images/home/home-services-section-photo-1605745341112-85968b19335b-04.webp", "/images/import-export/home-service-global-trade-lanes-01.webp"],

  ["/images/home/our-projects-page-photo-1503387762-592deb58ef4e-01.webp", "/images/construction/our-work-commercial-complex-site-01.webp"],
  ["/images/home/our-projects-page-photo-1541888946425-d81bb19240f5-02.webp", "/images/construction/our-work-commercial-complex-structure-02.webp"],
  ["/images/home/our-projects-page-photo-1486406146926-c627a92ad1ab-03.webp", "/images/construction/our-work-commercial-complex-handover-03.webp"],
  ["/images/home/our-projects-page-photo-1600585154340-be6161a56a0c-04.webp", "/images/architecture/our-work-luxury-villa-interior-01.webp"],
  ["/images/home/our-projects-page-photo-1600210492493-0946911123ea-05.webp", "/images/architecture/our-work-luxury-villa-material-board-02.webp"],
  ["/images/home/our-projects-page-photo-1618220179428-22790b461013-06.webp", "/images/architecture/our-work-luxury-villa-evening-court-03.webp"],
  ["/images/home/our-projects-page-photo-1560518883-ce09059eeffa-07.webp", "/images/real-estate/our-work-launch-residence-facade-01.webp"],
  ["/images/home/our-projects-page-photo-1486406146926-c627a92ad1ab-08.webp", "/images/real-estate/our-work-launch-residence-lobby-02.webp"],
  ["/images/home/our-projects-page-photo-1494526585095-c41746248156-09.webp", "/images/real-estate/our-work-launch-residence-sales-suite-03.webp"],
  ["/images/home/our-projects-page-photo-1497366754035-f200968a6e72-10.webp", "/images/architecture/our-work-corporate-office-atrium-01.webp"],
  ["/images/home/our-projects-page-photo-1497366811353-6870744d04b2-11.webp", "/images/architecture/our-work-corporate-office-boardroom-02.webp"],
  ["/images/home/our-projects-page-photo-1504384308090-c894fdcc538d-12.webp", "/images/architecture/our-work-corporate-office-facade-03.webp"],
  ["/images/home/our-projects-page-photo-1494412651409-8963ce7935a7-13.webp", "/images/import-export/our-work-export-import-hub-terminal-01.webp"],
  ["/images/home/our-projects-page-photo-1605745341112-85968b19335b-14.webp", "/images/import-export/our-work-export-import-hub-warehouse-02.webp"],
  ["/images/home/our-projects-page-photo-1578575437130-527eed3abbec-15.webp", "/images/import-export/our-work-export-import-hub-route-map-03.webp"],

  ["/images/home/who-we-are-enterprise-showcase-photo-1486406146926-c627a92ad1ab-01.webp", "/images/architecture/who-we-are-architecture-tower-01.webp"],
  ["/images/home/who-we-are-enterprise-showcase-photo-1503387762-592deb58ef4e-02.webp", "/images/construction/who-we-are-construction-grid-01.webp"],
  ["/images/home/who-we-are-enterprise-showcase-photo-1560518883-ce09059eeffa-03.webp", "/images/real-estate/who-we-are-real-estate-frontage-01.webp"],
  ["/images/home/who-we-are-enterprise-showcase-photo-1494412574643-ff11b0a5c1c3-04.webp", "/images/import-export/who-we-are-global-trade-port-01.webp"],

  ["/images/home/ecosystem-expansion-experience-photo-1494412574643-ff11b0a5c1c3-01.webp", "/images/import-export/ecosystem-expansion-global-route-grid-01.webp"],
  ["/images/home/ecosystem-expansion-experience-photo-1600607687920-4e2a09cf159d-02.webp", "/images/architecture/ecosystem-expansion-spatial-blueprint-01.webp"],
  ["/images/home/ecosystem-expansion-experience-photo-1503387762-592deb58ef4e-03.webp", "/images/infrastructure/ecosystem-expansion-infrastructure-command-01.webp"],

  ["/images/careers/premium-careers-page-photo-1497366754035-f200968a6e72-01.webp", "/images/careers/careers-operational-precision-room-01.webp"],
  ["/images/careers/premium-careers-page-photo-1497215728101-856f4ea42174-02.webp", "/images/careers/careers-creative-intelligence-studio-01.webp"],
  ["/images/careers/premium-careers-page-photo-1552664730-d307ca884978-03.webp", "/images/careers/careers-enterprise-collaboration-hub-01.webp"],
  ["/images/careers/premium-careers-page-photo-1551288049-bebda4e38f71-04.webp", "/images/careers/careers-execution-standards-room-01.webp"],
  ["/images/careers/premium-careers-page-photo-1497366811353-6870744d04b2-05.webp", "/images/careers/careers-modern-workplace-culture-01.webp"],

  ["/images/blogs/blog-enterprise-page-photo-1486406146926-c627a92ad1ab-01.webp", "/images/blogs/blog-editorial-hero-enterprise-desk-01.webp"],
  ["/images/blogs/blog-seed-data-photo-1503387762-592deb58ef4e-07.webp", "/images/blogs/blog-accountable-construction-system-07.webp"],
  ["/images/blogs/blog-seed-data-photo-1497366754035-f200968a6e72-08.webp", "/images/blogs/blog-design-intelligence-studio-08.webp"],
  ["/images/blogs/blog-seed-data-photo-1494412574643-ff11b0a5c1c3-09.webp", "/images/blogs/blog-international-commerce-workflow-09.webp"],

  ["/images/industrial-design/landscape-planning-experience-photo-1761637823407-ef47925c2714-06.webp", "/images/industrial-design/landscape-planning-showcase-garden-court-01.webp"],

  ["/images/home/fallback-content-photo-1486406146926-c627a92ad1ab-01.avif", "/images/home/home-og-enterprise-ecosystem-01.avif"],
  ["/images/home/fallback-content-photo-1560250097-0b93528c311a-02.webp", "/images/founder/founder-profile-studio-01.webp"],
  ["/images/home/fallback-content-photo-1518005020951-eccb494ad742-03.avif", "/images/founder/founder-hero-executive-suite-01.avif"],
  ["/images/home/fallback-content-photo-1486406146926-c627a92ad1ab-04.webp", "/images/founder/founder-gallery-enterprise-map-01.webp"],
  ["/images/home/fallback-content-photo-1497366754035-f200968a6e72-05.webp", "/images/founder/founder-gallery-architecture-desk-02.webp"],
  ["/images/home/fallback-content-photo-1503387762-592deb58ef4e-06.webp", "/images/founder/founder-gallery-global-office-03.webp"],
  ["/images/home/fallback-content-photo-1573496359142-b8d87734a5a2-07.webp", "/images/founder/director-construction-delivery-01.webp"],
  ["/images/home/fallback-content-photo-1551836022-d5d88e9218df-08.webp", "/images/founder/director-design-studio-02.webp"],
  ["/images/home/fallback-content-photo-1519085360753-af0119f7cbe7-09.webp", "/images/founder/director-enterprise-operations-03.webp"],
  ["/images/home/fallback-content-photo-1497366754035-f200968a6e72-10.webp", "/images/architecture/business-division-architecture-studio-01.webp"],
  ["/images/home/fallback-content-photo-1503387762-592deb58ef4e-11.webp", "/images/construction/business-division-construction-site-01.webp"],
  ["/images/home/fallback-content-photo-1560518883-ce09059eeffa-12.webp", "/images/real-estate/business-division-real-estate-asset-01.webp"],
  ["/images/home/fallback-content-photo-1494412574643-ff11b0a5c1c3-13.webp", "/images/import-export/business-division-global-trade-01.webp"],
  ["/images/home/fallback-content-photo-1450101499163-c8848c66ca85-15.webp", "/images/admin/trademark-certificate-preview-01.webp"],
  ["/images/home/fallback-content-photo-1486406146926-c627a92ad1ab-16.webp", "/images/home/fallback-page-business-ecosystem-01.webp"],
  ["/images/home/fallback-content-photo-1497366811353-6870744d04b2-17.webp", "/images/home/fallback-page-services-command-01.webp"],

  ["/images/architecture/page-gallery-exterior-01.webp", "/images/architecture/about-division-architecture-courtyard-01.webp"],
  ["/images/infrastructure/page-infrastructure-premium-bg-02.webp", "/images/construction/about-division-construction-framework-01.webp"],
  ["/images/architecture/page-gallery-lobby-03.webp", "/images/real-estate/about-division-real-estate-lobby-01.webp"],
  ["/images/import-export/page-global-trade-transport-04.webp", "/images/import-export/about-division-trade-terminal-01.webp"]
]);

const localCoverFallbacks = Array.from({ length: 10 }, (_, index) => {
  const n = String(index + 1).padStart(2, "0");
  return `  "/images/blogs/blog-local-cover-fallback-${n}.webp"`;
});

const filesToRewrite = [
  "apps/web/src/components/Navbar.tsx",
  "apps/web/src/components/HomeServicesSection.tsx",
  "apps/web/src/components/OurProjectsPage.tsx",
  "apps/web/src/components/WhoWeAreEnterpriseShowcase.tsx",
  "apps/web/src/components/EcosystemExpansionExperience.tsx",
  "apps/web/src/components/PremiumCareersPage.tsx",
  "apps/web/src/components/BlogEnterprisePage.tsx",
  "apps/web/src/components/LandscapePlanningExperience.tsx",
  "apps/web/src/data/fallbackContent.ts",
  "apps/web/src/app/about/page.tsx",
  "apps/api/prisma/blogSeedData.ts",
  "apps/web/src/lib/api.ts"
];

function hashSeed(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rng(seedText) {
  let state = hashSeed(seedText) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function tone(hex, amount) {
  const value = hex.replace("#", "");
  const parts = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
  const mixed = parts.map((part) => Math.max(0, Math.min(255, Math.round(part + (amount >= 0 ? (255 - part) * amount : part * amount)))));
  return `#${mixed.map((part) => part.toString(16).padStart(2, "0")).join("")}`;
}

function poly(points, attrs = "") {
  return `<polygon points="${points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" ${attrs}/>`;
}

function line(x1, y1, x2, y2, attrs = "") {
  return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" ${attrs}/>`;
}

function rect(x, y, w, h, attrs = "") {
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" ${attrs}/>`;
}

function architectureMotif(rand, p, w, h) {
  const items = [];
  for (let i = 0; i < 8; i += 1) {
    const bw = w * (0.055 + rand() * 0.045);
    const bh = h * (0.22 + rand() * 0.42);
    const x = w * (0.18 + i * 0.083 + rand() * 0.025);
    const y = h * (0.72 - bh / h + rand() * 0.035);
    items.push(rect(x, y, bw, bh, `rx="3" fill="${i % 2 ? p.ink : tone(p.ink, 0.08)}" opacity="${0.78 - i * 0.03}"`));
    for (let f = 0; f < 6; f += 1) {
      items.push(rect(x + bw * 0.22, y + bh * (0.16 + f * 0.12), bw * 0.56, 2, `fill="${p.gold}" opacity="0.34"`));
    }
  }
  items.push(poly([[w * 0.1, h * 0.76], [w * 0.48, h * 0.52], [w * 0.9, h * 0.76], [w * 0.51, h * 0.94]], `fill="${p.gold}" opacity="0.14"`));
  items.push(poly([[w * 0.17, h * 0.7], [w * 0.48, h * 0.54], [w * 0.81, h * 0.7], [w * 0.49, h * 0.86]], `fill="none" stroke="${p.mist}" stroke-width="2" opacity="0.42"`));
  return items.join("");
}

function constructionMotif(rand, p, w, h) {
  const items = [];
  const baseY = h * 0.76;
  for (let i = 0; i < 7; i += 1) {
    const x = w * (0.16 + i * 0.105);
    items.push(line(x, h * 0.24, x, baseY, `stroke="${i % 2 ? p.gold : p.mist}" stroke-width="3" opacity="0.34"`));
    items.push(line(w * 0.12, baseY - i * 34, w * 0.88, baseY - i * 34, `stroke="${p.ink}" stroke-width="2" opacity="0.28"`));
  }
  items.push(line(w * 0.14, h * 0.27, w * 0.78, h * 0.27, `stroke="${p.gold}" stroke-width="7" opacity="0.75"`));
  items.push(line(w * 0.22, h * 0.27, w * 0.22, h * 0.72, `stroke="${p.gold}" stroke-width="5" opacity="0.72"`));
  items.push(line(w * 0.22, h * 0.31, w * 0.52, h * 0.55, `stroke="${p.gold}" stroke-width="3" opacity="0.56"`));
  items.push(line(w * 0.52, h * 0.27, w * 0.52, h * 0.4, `stroke="${p.gold}" stroke-width="3" opacity="0.55"`));
  items.push(rect(w * 0.18, h * 0.68, w * 0.66, h * 0.15, `fill="${p.ink}" opacity="0.52"`));
  items.push(poly([[w * 0.18, h * 0.68], [w * 0.84, h * 0.68], [w * 0.76, h * 0.61], [w * 0.25, h * 0.6]], `fill="${p.red}" opacity="0.18"`));
  return items.join("");
}

function tradeMotif(rand, p, w, h) {
  const items = [];
  for (let i = 0; i < 12; i += 1) {
    const x = w * (0.16 + (i % 6) * 0.115);
    const y = h * (0.61 + Math.floor(i / 6) * 0.085);
    items.push(rect(x, y, w * 0.1, h * 0.065, `rx="2" fill="${i % 3 === 0 ? p.red : i % 2 ? p.gold : p.ink}" opacity="${0.42 + rand() * 0.25}"`));
  }
  for (let i = 0; i < 6; i += 1) {
    const y = h * (0.22 + i * 0.065);
    items.push(`<path d="M${w * 0.1} ${y} C ${w * 0.32} ${y - 130}, ${w * 0.62} ${y + 120}, ${w * 0.92} ${y - 30}" fill="none" stroke="${i % 2 ? p.gold : p.mist}" stroke-width="${2 + i * 0.3}" opacity="${0.16 + i * 0.045}"/>`);
  }
  items.push(poly([[w * 0.52, h * 0.49], [w * 0.76, h * 0.43], [w * 0.7, h * 0.54], [w * 0.48, h * 0.58]], `fill="${p.mist}" opacity="0.2"`));
  items.push(rect(w * 0.55, h * 0.36, w * 0.18, h * 0.09, `fill="${p.ink}" opacity="0.42"`));
  return items.join("");
}

function realEstateMotif(rand, p, w, h) {
  const items = [];
  for (let i = 0; i < 6; i += 1) {
    const x = w * (0.2 + i * 0.1);
    const bh = h * (0.28 + rand() * 0.24);
    items.push(rect(x, h * 0.66 - bh, w * 0.075, bh, `rx="5" fill="${i % 2 ? tone(p.ink, 0.05) : p.ink}" opacity="${0.62 - i * 0.025}"`));
    items.push(rect(x + w * 0.014, h * 0.69 - bh, w * 0.047, bh * 0.86, `fill="${p.mist}" opacity="0.11"`));
  }
  items.push(`<path d="M${w * 0.08} ${h * 0.75} C ${w * 0.25} ${h * 0.65}, ${w * 0.38} ${h * 0.88}, ${w * 0.54} ${h * 0.72} S ${w * 0.77} ${h * 0.67}, ${w * 0.94} ${h * 0.78}" fill="none" stroke="${p.gold}" stroke-width="12" opacity="0.36"/>`);
  items.push(poly([[w * 0.1, h * 0.82], [w * 0.49, h * 0.69], [w * 0.92, h * 0.83], [w * 0.48, h * 0.98]], `fill="${p.gold}" opacity="0.13"`));
  return items.join("");
}

function careersMotif(rand, p, w, h) {
  const items = [];
  for (let i = 0; i < 4; i += 1) {
    const x = w * (0.2 + i * 0.15);
    items.push(rect(x, h * 0.36, w * 0.12, h * 0.18, `rx="12" fill="${i % 2 ? p.ink : p.mist}" opacity="${i % 2 ? 0.52 : 0.2}" stroke="${p.gold}" stroke-width="2"`));
    items.push(`<circle cx="${(x + w * 0.06).toFixed(1)}" cy="${(h * 0.31).toFixed(1)}" r="${(w * 0.025).toFixed(1)}" fill="${p.gold}" opacity="0.54"/>`);
  }
  items.push(rect(w * 0.12, h * 0.64, w * 0.76, h * 0.08, `rx="10" fill="${p.ink}" opacity="0.5"`));
  items.push(line(w * 0.18, h * 0.72, w * 0.82, h * 0.72, `stroke="${p.gold}" stroke-width="3" opacity="0.34"`));
  return items.join("");
}

function blogMotif(rand, p, w, h) {
  const items = [];
  for (let i = 0; i < 5; i += 1) {
    const x = w * (0.18 + i * 0.12);
    const y = h * (0.23 + (i % 2) * 0.08);
    items.push(rect(x, y, w * 0.2, h * 0.34, `rx="12" fill="${i % 2 ? p.mist : p.ink}" opacity="${i % 2 ? 0.22 : 0.45}" stroke="${p.gold}" stroke-width="2" transform="rotate(${(-8 + i * 4).toFixed(1)} ${x + w * 0.1} ${y + h * 0.17})"`));
  }
  items.push(rect(w * 0.2, h * 0.62, w * 0.6, h * 0.08, `rx="10" fill="${p.gold}" opacity="0.42"`));
  items.push(line(w * 0.2, h * 0.76, w * 0.8, h * 0.76, `stroke="${p.mist}" stroke-width="2" opacity="0.28"`));
  return items.join("");
}

function founderMotif(rand, p, w, h) {
  const items = [];
  items.push(rect(w * 0.18, h * 0.58, w * 0.64, h * 0.12, `rx="16" fill="${p.ink}" opacity="0.42"`));
  items.push(rect(w * 0.28, h * 0.22, w * 0.44, h * 0.3, `rx="22" fill="${p.mist}" opacity="0.18" stroke="${p.gold}" stroke-width="2"`));
  items.push(`<circle cx="${w * 0.5}" cy="${h * 0.37}" r="${w * 0.07}" fill="${p.gold}" opacity="0.32"/>`);
  items.push(`<path d="M${w * 0.32} ${h * 0.55} C ${w * 0.42} ${h * 0.47}, ${w * 0.58} ${h * 0.47}, ${w * 0.68} ${h * 0.55}" fill="none" stroke="${p.gold}" stroke-width="10" opacity="0.28"/>`);
  items.push(line(w * 0.18, h * 0.76, w * 0.82, h * 0.76, `stroke="${p.gold}" stroke-width="3" opacity="0.4"`));
  return items.join("");
}

function contactMotif(rand, p, w, h) {
  const items = [];
  for (let i = 0; i < 4; i += 1) {
    items.push(rect(w * (0.18 + i * 0.16), h * (0.26 + i * 0.035), w * 0.13, h * 0.28, `rx="14" fill="${i % 2 ? p.ink : p.mist}" opacity="${i % 2 ? 0.5 : 0.18}" stroke="${p.gold}" stroke-width="2"`));
  }
  for (let i = 0; i < 5; i += 1) {
    const x1 = w * (0.18 + i * 0.13);
    const y1 = h * (0.64 + rand() * 0.08);
    items.push(`<circle cx="${x1}" cy="${y1}" r="8" fill="${p.gold}" opacity="0.58"/>`);
    if (i > 0) items.push(line(w * (0.18 + (i - 1) * 0.13), h * 0.68, x1, y1, `stroke="${p.gold}" stroke-width="2" opacity="0.3"`));
  }
  return items.join("");
}

function landscapeMotif(rand, p, w, h) {
  const items = [];
  for (let i = 0; i < 7; i += 1) {
    const cx = w * (0.16 + i * 0.12);
    const cy = h * (0.48 + rand() * 0.18);
    items.push(`<path d="M${cx} ${cy + 130} C ${cx - 90} ${cy + 30}, ${cx - 40} ${cy - 80}, ${cx} ${cy - 120} C ${cx + 70} ${cy - 50}, ${cx + 70} ${cy + 60}, ${cx} ${cy + 130}" fill="${i % 2 ? p.ink : p.gold}" opacity="${0.18 + rand() * 0.2}"/>`);
  }
  items.push(`<path d="M${w * 0.08} ${h * 0.78} C ${w * 0.28} ${h * 0.66}, ${w * 0.36} ${h * 0.91}, ${w * 0.54} ${h * 0.74} S ${w * 0.78} ${h * 0.63}, ${w * 0.94} ${h * 0.81}" fill="none" stroke="${p.gold}" stroke-width="18" opacity="0.28"/>`);
  return items.join("");
}

function motifSvg(kind, rand, p, w, h) {
  switch (kind) {
    case "architecture":
    case "interior":
      return architectureMotif(rand, p, w, h);
    case "construction":
      return constructionMotif(rand, p, w, h);
    case "trade":
      return tradeMotif(rand, p, w, h);
    case "realEstate":
      return realEstateMotif(rand, p, w, h);
    case "careers":
      return careersMotif(rand, p, w, h);
    case "blog":
      return blogMotif(rand, p, w, h);
    case "founder":
      return founderMotif(rand, p, w, h);
    case "contact":
      return contactMotif(rand, p, w, h);
    case "landscape":
      return landscapeMotif(rand, p, w, h);
    case "portfolio":
    case "services":
    case "ecosystem":
    default:
      return [
        architectureMotif(rand, p, w, h),
        `<path d="M${w * 0.08} ${h * 0.3} C ${w * 0.28} ${h * 0.08}, ${w * 0.67} ${h * 0.18}, ${w * 0.92} ${h * 0.36}" fill="none" stroke="${p.gold}" stroke-width="5" opacity="0.28"/>`,
        `<circle cx="${w * 0.74}" cy="${h * 0.28}" r="${w * 0.09}" fill="${p.red}" opacity="0.14"/>`
      ].join("");
  }
}

function svgForAsset(asset) {
  const size = asset.file.endsWith(".avif") ? avifSize : webpSize;
  const { width: w, height: h } = size;
  const p = palettes[asset.palette] ?? palettes.home;
  const rand = rng(asset.file);
  const angle = Math.round(20 + rand() * 120);
  const accentX = Math.round(20 + rand() * 60);
  const accentY = Math.round(12 + rand() * 72);
  const grainSeed = Math.round(rand() * 10000);
  const motif = motifSvg(asset.motif, rand, p, w, h);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1" gradientTransform="rotate(${angle} .5 .5)">
      <stop offset="0" stop-color="${p.base}"/>
      <stop offset=".46" stop-color="${tone(p.base, -0.08)}"/>
      <stop offset="1" stop-color="${tone(p.ink, 0.03)}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${accentX}%" cy="${accentY}%" r="68%">
      <stop offset="0" stop-color="${p.gold}" stop-opacity=".46"/>
      <stop offset=".38" stop-color="${p.red}" stop-opacity=".16"/>
      <stop offset="1" stop-color="${p.ink}" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="${grainSeed}" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 .085"/>
      </feComponentTransfer>
    </filter>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="36" stdDeviation="42" flood-color="${p.ink}" flood-opacity=".26"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <g opacity=".18" stroke="${p.ink}" stroke-width="1">
    ${Array.from({ length: 16 }, (_, i) => line(0, h * (i / 15), w, h * (i / 15), "")).join("")}
    ${Array.from({ length: 22 }, (_, i) => line(w * (i / 21), 0, w * (i / 21), h, "")).join("")}
  </g>
  <g filter="url(#softShadow)">${motif}</g>
  <rect x="${w * 0.055}" y="${h * 0.07}" width="${w * 0.89}" height="${h * 0.86}" rx="18" fill="none" stroke="${p.mist}" stroke-opacity=".24" stroke-width="2"/>
  <rect x="${w * 0.075}" y="${h * 0.095}" width="${w * 0.85}" height="${h * 0.81}" rx="10" fill="none" stroke="${p.gold}" stroke-opacity=".24" stroke-width="1.5"/>
  <path d="M0 ${h * 0.84} C ${w * 0.22} ${h * 0.72}, ${w * 0.36} ${h * 0.98}, ${w * 0.58} ${h * 0.84} S ${w * 0.84} ${h * 0.74}, ${w} ${h * 0.88} L ${w} ${h} L 0 ${h} Z" fill="${p.ink}" opacity=".18"/>
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity=".72"/>
</svg>`;
}

async function generateAssets() {
  const generated = [];
  const skipped = [];
  for (const asset of assets) {
    const target = path.join(projectRoot, asset.file);
    await fs.mkdir(path.dirname(target), { recursive: true });
    try {
      await fs.access(target);
      skipped.push(asset.file);
      continue;
    } catch {
      // Missing assets are rendered below.
    }

    const svg = svgForAsset(asset);
    const image = sharp(Buffer.from(svg));
    if (asset.file.endsWith(".avif")) {
      await image.avif({ quality: 62, effort: 4 }).toFile(target);
    } else {
      await image.webp({ quality: 86, effort: 3 }).toFile(target);
    }
    generated.push(asset.file);
  }
  return { generated, skipped };
}

async function rewriteFiles() {
  let changedFiles = 0;
  for (const relativeFile of filesToRewrite) {
    const file = path.join(projectRoot, relativeFile);
    let text = await fs.readFile(file, "utf8");
    const before = text;
    for (const [oldValue, newValue] of globalReplacements) {
      text = text.split(oldValue).join(newValue);
    }

    if (relativeFile === "apps/web/src/lib/api.ts") {
      text = text.replace(
        /const localCoverImageFallbacks = \[[\s\S]*?\] as const;/,
        `const localCoverImageFallbacks = [\n${localCoverFallbacks.join(",\n")}\n] as const;`
      );
    }

    if (text !== before) {
      await fs.writeFile(file, text);
      changedFiles += 1;
    }
  }
  return changedFiles;
}

async function verifyGeneratedUniqueness(files) {
  const hashes = new Map();
  for (const relativeFile of files) {
    const target = path.join(projectRoot, relativeFile);
    const buffer = await fs.readFile(target);
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    if (!hashes.has(hash)) hashes.set(hash, []);
    hashes.get(hash).push(relativeFile);
  }

  const duplicates = [...hashes.values()].filter((group) => group.length > 1);
  if (duplicates.length) {
    throw new Error(`Generated duplicate binary assets: ${JSON.stringify(duplicates, null, 2)}`);
  }
}

const { generated, skipped } = await generateAssets();
const changedFiles = await rewriteFiles();
await verifyGeneratedUniqueness([...generated, ...skipped]);

console.log(
  JSON.stringify(
    {
      generatedAssets: generated.length,
      skippedAssets: skipped.length,
      webp: generated.filter((file) => file.endsWith(".webp")).length,
      avif: generated.filter((file) => file.endsWith(".avif")).length,
      changedFiles
    },
    null,
    2
  )
);
