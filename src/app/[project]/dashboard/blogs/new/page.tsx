"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { BlogForm } from "@/components/admin/blog/BlogForm";

export default function NewBlogPage() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  return (
    <DashboardShell activeView="blogs">
      <BlogForm projectSlug={slug} />
    </DashboardShell>
  );
}
