"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { BlogForm } from "@/components/admin/blog/BlogForm";

export default function EditBlogPage() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  const id = typeof params?.id === "string" ? params.id : "";

  const [blog, setBlog] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        const result = await res.json();
        if (result.success) setBlog(result.data);
        else setError(result.message || "Blog not found.");
      } catch {
        setError("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <DashboardShell activeView="blogs">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
        </div>
      </DashboardShell>
    );
  }

  if (error || !blog) {
    return (
      <DashboardShell activeView="blogs">
        <div className="px-3 py-16 text-center text-sm text-red-400">
          {error || "Blog not found."}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell activeView="blogs">
      <BlogForm
        projectSlug={slug}
        isEditing
        initialData={{
          id: blog.id as string,
          title: blog.title as string,
          slug: blog.slug as string,
          excerpt: blog.excerpt as string,
          content: blog.content as string,
          featuredImage: ((blog.coverImage || blog.featuredImage) as string) || "",
          category: blog.category as string,
          tags: (blog.tags as string[]) || [],
          author: blog.author as string,
          seoTitle: (blog.seoTitle as string) || "",
          seoDescription: (blog.seoDescription as string) || "",
          status: (blog.status as "draft" | "published") || "draft",
        }}
      />
    </DashboardShell>
  );
}
