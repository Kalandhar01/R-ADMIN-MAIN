import { ArchitectureCinematicExperience } from "@/components/ArchitectureCinematicExperience";
import { getArchitecturePageData } from "@/lib/architectureCms";
import { seoContent } from "@/lib/architecturePremiumContent";

export const revalidate = 300;

const architectureStructuredData = {
  "@context": "https://schema.org",
  "@type": "ArchitecturalService",
  name: "Ractysh Architecture",
  url: "https://architecture.ractysh.com",
  logo: "https://architecture.ractysh.com/images/architecture/ractysh-architecture-logo.webp",
  image: "https://architecture.ractysh.com/images/architecture/ractysh-built-beyond-blueprints-poster.webp",
  description: seoContent.metaDescription,
  areaServed: ["Coimbatore", "Palani", "Dindigul", "Tamil Nadu", "Kerala", "Bengaluru", "Chennai", "International"],
  email: "hello@ractysh.com",
  parentOrganization: {
    "@type": "Organization",
    name: "Ractysh Group",
    url: "https://ractysh.com"
  },
  serviceType: [
    "Architectural Design",
    "Interior Design",
    "Structural Design",
    "MEP Design",
    "Landscape Design",
    "Urban Planning",
    "3D Modelling & Visualisation",
    "Architectural Rendering",
    "Furniture Design",
    "Architectural Lighting Design",
    "Elevation Design",
    "Commercial Building Design",
    "Project Management Consultancy",
    "Logo Design"
  ]
};

export default async function Home() {
  const data = await getArchitecturePageData();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(architectureStructuredData) }} />
      <ArchitectureCinematicExperience hero={data.hero} projects={data.projects} />
    </>
  );
}
