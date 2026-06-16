export const storyBlocks = [
  {
    number: "01",
    eyebrow: "Studio",
    title: "Architecture begins before the line is drawn.",
    body:
      "Ractysh studies terrain, climate, arrival, silence, family ritual, and light before a formal language appears. The result is not a facade exercise. It is a spatial position."
  },
  {
    number: "02",
    eyebrow: "Region",
    title: "South Indian context, international restraint.",
    body:
      "Kerala shade, Tamil Nadu heat, tropical landscape, stone, timber, air movement, and privacy are composed with the calm of an architectural journal."
  },
  {
    number: "03",
    eyebrow: "Experience",
    title: "Every threshold is treated as a scene.",
    body:
      "A residence is edited as a sequence: approach, reveal, compression, courtyard, view, pause, and return. Luxury is measured by proportion, not ornament."
  }
] as const;

export const editorialPanels = [
  {
    number: "I",
    title: "The site becomes the first author.",
    body:
      "Slope, heat, wind, street edge, trees, and view corridors are treated as active design material before the building begins to take shape."
  },
  {
    number: "II",
    title: "Material is edited with restraint.",
    body:
      "Stone, glass, timber, concrete, water, and shadow are composed to feel calm at first glance and precise on closer reading."
  },
  {
    number: "III",
    title: "Light is measured like structure.",
    body:
      "Every opening, court, overhang, and threshold is shaped around the hour of day it will be remembered in."
  }
] as const;

export const processStages = [
  {
    number: "01",
    name: "Concept",
    line: "Site memory, climate, massing, orientation, privacy, and the first architectural proposition."
  },
  {
    number: "02",
    name: "Planning",
    line: "Spatial hierarchy, circulation, regulations, services, structure, and coordinated plan logic."
  },
  {
    number: "03",
    name: "Visualization",
    line: "Photoreal studies, material direction, atmosphere, and decision-grade architectural views."
  },
  {
    number: "04",
    name: "Execution",
    line: "Consultant coordination, site rhythm, detail guardianship, procurement clarity, and final reveal."
  }
] as const;

export const projects = [
  {
    number: "01",
    kicker: "Luxury Kerala Villa",
    title: "Laterite Court Residence",
    place: "Kochi / Kerala",
    image: "/images/architecture/ractysh-laterite-court-residence.avif",
    alt: "Modern tropical villa with pool, timber, stone, and shaded exterior spaces",
    scale: "Private villa",
    detail: "A villa composition shaped by shaded living, poolside calm, tropical edges, and quiet stone mass."
  },
  {
    number: "02",
    kicker: "Tamil Nadu Residence",
    title: "Coimbatore Linear House",
    place: "Coimbatore / Tamil Nadu",
    image: "/images/architecture/ractysh-coimbatore-linear-house.avif",
    alt: "Contemporary residence with timber roof planes, lawn, stone, and glass",
    scale: "Family residence",
    detail: "A linear home tuned for heat, privacy, verandah depth, and a clean everyday sequence."
  },
  {
    number: "03",
    kicker: "Commercial Architecture",
    title: "Executive Work Pavilion",
    place: "Chennai / Tamil Nadu",
    image: "/images/architecture/ractysh-executive-work-pavilion.avif",
    alt: "Modern glass commercial building facade photographed from a low angle",
    scale: "Commercial building",
    detail: "A work environment built around arrival gravity, glass rhythm, and a composed urban presence."
  },
  {
    number: "04",
    kicker: "Enterprise Building",
    title: "Graphite Tower House",
    place: "Bengaluru / South India",
    image: "/images/architecture/ractysh-graphite-tower-house.avif",
    alt: "Contemporary urban courtyard with reflective tiles and modern building forms",
    scale: "Enterprise campus",
    detail: "A precise institutional study of facade rhythm, open court, reflection, and controlled movement."
  },
  {
    number: "05",
    kicker: "Waterfront Residence",
    title: "Backwater Edge Villa",
    place: "Alappuzha / Kerala",
    image: "/images/architecture/ractysh-backwater-edge-villa.avif",
    alt: "Architectural visualization of a modern residence with pool and glass reflections",
    scale: "Waterfront home",
    detail: "A horizontal villa language where water, garden, glass, and roof shade become the primary materials."
  },
  {
    number: "06",
    kicker: "Courtyard Home",
    title: "Madurai Quiet Court",
    place: "Madurai / Tamil Nadu",
    image: "/images/architecture/ractysh-madurai-quiet-court.avif",
    alt: "Luxury courtyard with stone walls, fire table, glass, and evening architectural lighting",
    scale: "Courtyard residence",
    detail: "A private interior world organized around stone, dusk light, silence, and a central open-air court."
  }
] as const;

export const studioMetrics = [
  ["06", "built typologies"],
  ["04", "disciplined phases"],
  ["01", "architectural language"]
] as const;
