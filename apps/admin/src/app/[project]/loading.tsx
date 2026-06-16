"use client";

import { useParams } from "next/navigation";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { adminProjectRouteBySlug, fallbackProjectRoute } from "@/lib/admin/projects";

const baseStates = [
  { text: "Initializing command interface" },
  { text: "Establishing secure channel" },
  { text: "Authenticating admin credentials" },
  { text: "Loading database records" },
  { text: "Indexing project intelligence" },
  { text: "Synchronizing operational data" },
  { text: "Deploying command dashboard" },
];

export default function ProjectLoading() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  const project = adminProjectRouteBySlug(slug) ?? fallbackProjectRoute(slug);

  const loadingStates = [
    { text: `Opening ${project.label}` },
    ...baseStates,
  ];

  return (
    <div className="relative min-h-screen bg-[#080808]">
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(184,134,11,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,134,11,.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />
      <MultiStepLoader loadingStates={loadingStates} loading={true} duration={1800} loop={false} />
    </div>
  );
}
