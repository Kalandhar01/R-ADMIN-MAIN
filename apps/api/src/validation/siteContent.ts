import { z } from "zod";

const navItemSchema: z.ZodTypeAny = z.lazy(() =>
  z.object({
    label: z.string().min(1),
    href: z.string().min(1),
    children: z
      .array(
        z.object({
          label: z.string().min(1),
          description: z.string(),
          href: z.string().min(1)
        })
      )
      .optional()
  })
);

const socialLinkSchema = z.object({
  label: z.string(),
  href: z.string()
});

const timelineItemSchema = z.object({
  year: z.string(),
  title: z.string(),
  description: z.string()
});

const certificationSchema = z.object({
  title: z.string(),
  issuer: z.string(),
  year: z.string(),
  fileUrl: z.string().optional()
});

export const siteContentSchema = z.object({
  seo: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
    canonicalUrl: z.string().optional()
  }),
  theme: z.object({
    mode: z.enum(["dark", "light"]),
    accent: z.string().min(3)
  }),
  nav: z.object({
    logoText: z.string().min(1),
    items: z.array(navItemSchema)
  }),
  hero: z.object({
    eyebrow: z.string(),
    headline: z.string().min(3),
    subheadline: z.string(),
    primaryCta: z.string(),
    secondaryCta: z.string(),
    trustLine: z.string()
  }),
  divisions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      legalName: z.string(),
      summary: z.string(),
      services: z.array(z.string()),
      metric: z.string()
    })
  ),
  services: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      company: z.string(),
      tags: z.array(z.string()),
      image: z.string().optional(),
      href: z.string().optional()
    })
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      category: z.string(),
      location: z.string(),
      summary: z.string(),
      year: z.string()
    })
  ),
  stats: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      suffix: z.string()
    })
  ),
  testimonials: z.array(
    z.object({
      quote: z.string(),
      name: z.string(),
      role: z.string(),
      rating: z.number().optional(),
      approved: z.boolean().optional()
    })
  ),
  blogs: z.array(
    z.object({
      title: z.string(),
      category: z.string(),
      excerpt: z.string(),
      date: z.string(),
      slug: z.string().optional(),
      image: z.string().optional(),
      readingTime: z.string().optional(),
      tags: z.array(z.string()).optional(),
      body: z.string().optional()
    })
  ),
  founder: z.object({
    name: z.string(),
    role: z.string(),
    image: z.string(),
    heroImage: z.string(),
    shortArticle: z.string(),
    biography: z.string(),
    vision: z.string(),
    mission: z.string(),
    resumeSummary: z.string(),
    achievements: z.array(z.string()),
    timeline: z.array(timelineItemSchema),
    certifications: z.array(certificationSchema),
    awards: z.array(z.string()),
    socialLinks: z.array(socialLinkSchema),
    gallery: z.array(z.string())
  }),
  directors: z.array(
    z.object({
      name: z.string(),
      position: z.string(),
      image: z.string(),
      experience: z.string(),
      biography: z.string(),
      leadershipStatement: z.string(),
      socialLinks: z.array(socialLinkSchema)
    })
  ),
  businessDivisions: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      eyebrow: z.string(),
      description: z.string(),
      image: z.string(),
      href: z.string(),
      cta: z.string(),
      metrics: z.array(
        z.object({
          label: z.string(),
          value: z.string()
        })
      ),
      highlights: z.array(z.string())
    })
  ),
  locations: z.array(
    z.object({
      name: z.string(),
      address: z.string(),
      outlookLocation: z.string(),
      phone: z.string(),
      email: z.string(),
      hours: z.string(),
      mapEmbedUrl: z.string()
    })
  ),
  legal: z.object({
    trademarkNotice: z.string(),
    certificateTitle: z.string(),
    certificateUrl: z.string(),
    certificatePreviewUrl: z.string(),
    documents: z.array(
      z.object({
        slug: z.string(),
        title: z.string(),
        summary: z.string(),
        body: z.string(),
        updatedAt: z.string()
      })
    )
  }),
  popup: z.object({
    enabled: z.boolean(),
    delayMs: z.number(),
    title: z.string(),
    description: z.string(),
    ctaLabel: z.string()
  }),
  googleRatings: z.object({
    score: z.number(),
    totalReviews: z.number(),
    rateUsUrl: z.string(),
    reviews: z.array(
      z.object({
        name: z.string(),
        role: z.string(),
        rating: z.number(),
        quote: z.string()
      })
    )
  }),
  feedback: z.object({
    title: z.string(),
    description: z.string(),
    email: z.string()
  }),
  careers: z.object({
    heroTitle: z.string(),
    intro: z.string(),
    culture: z.array(z.string()),
    jobs: z.array(
      z.object({
        title: z.string(),
        location: z.string(),
        type: z.string(),
        summary: z.string()
      })
    ),
    internships: z.array(
      z.object({
        title: z.string(),
        summary: z.string()
      })
    )
  }),
  pages: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      eyebrow: z.string(),
      description: z.string(),
      image: z.string(),
      sections: z.array(
        z.object({
          title: z.string(),
          body: z.string()
        })
      )
    })
  ),
  certifications: z.array(certificationSchema),
  milestones: z.array(timelineItemSchema),
  partners: z.array(
    z.object({
      name: z.string(),
      description: z.string()
    })
  ),
  sections: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      visible: z.boolean(),
      order: z.number()
    })
  ),
  footer: z.object({
    headline: z.string(),
    description: z.string(),
    links: z.array(navItemSchema),
    socialLinks: z.array(socialLinkSchema).optional()
  }),
  updatedAt: z.string()
});
