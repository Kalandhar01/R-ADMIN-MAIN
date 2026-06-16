import mongoose, { Schema } from "mongoose";
import type { SiteContent } from "../types/content.js";

const siteContentSchema = new Schema<SiteContent>(
  {
    seo: {
      title: { type: String, required: true },
      description: { type: String, required: true }
    },
    theme: {
      mode: { type: String, enum: ["dark", "light"], default: "dark" },
      accent: { type: String, default: "#ffffff" }
    },
    nav: {
      logoText: { type: String, required: true },
      items: [{ type: Schema.Types.Mixed }]
    },
    hero: {
      eyebrow: String,
      headline: String,
      subheadline: String,
      primaryCta: String,
      secondaryCta: String,
      trustLine: String
    },
    divisions: [{ type: Schema.Types.Mixed }],
    services: [{ type: Schema.Types.Mixed }],
    projects: [{ type: Schema.Types.Mixed }],
    stats: [{ type: Schema.Types.Mixed }],
    testimonials: [{ type: Schema.Types.Mixed }],
    blogs: [{ type: Schema.Types.Mixed }],
    founder: { type: Schema.Types.Mixed },
    directors: [{ type: Schema.Types.Mixed }],
    businessDivisions: [{ type: Schema.Types.Mixed }],
    locations: [{ type: Schema.Types.Mixed }],
    legal: { type: Schema.Types.Mixed },
    popup: { type: Schema.Types.Mixed },
    googleRatings: { type: Schema.Types.Mixed },
    feedback: { type: Schema.Types.Mixed },
    careers: { type: Schema.Types.Mixed },
    pages: [{ type: Schema.Types.Mixed }],
    certifications: [{ type: Schema.Types.Mixed }],
    milestones: [{ type: Schema.Types.Mixed }],
    partners: [{ type: Schema.Types.Mixed }],
    sections: [{ type: Schema.Types.Mixed }],
    footer: {
      headline: String,
      description: String,
      links: [{ type: Schema.Types.Mixed }]
    },
    updatedAt: { type: String, required: true }
  },
  { minimize: false }
);

export const SiteContentModel =
  mongoose.models.SiteContent || mongoose.model<SiteContent>("SiteContent", siteContentSchema);
