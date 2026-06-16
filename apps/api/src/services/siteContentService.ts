import { seedContent } from "../data/seed.js";
import { SiteContentModel } from "../models/SiteContent.js";
import type { SiteContent } from "../types/content.js";

let memoryContent: SiteContent = seedContent;
let mongoEnabled = false;

export function setMongoEnabled(value: boolean): void {
  mongoEnabled = value;
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!mongoEnabled) return memoryContent;

  const existing = await SiteContentModel.findOne().lean<SiteContent>();
  if (existing) return existing;

  const created = await SiteContentModel.create(seedContent);
  return created.toObject() as SiteContent;
}

export async function updateSiteContent(nextContent: SiteContent): Promise<SiteContent> {
  const content = {
    ...nextContent,
    updatedAt: new Date().toISOString()
  };

  if (!mongoEnabled) {
    memoryContent = content;
    return memoryContent;
  }

  const updated = await SiteContentModel.findOneAndUpdate({}, content, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  }).lean<SiteContent>();

  return updated || content;
}
