"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, Plus, Eye, Edit3, Globe, EyeOff, Trash2,
  BookOpenText, Image as ImageIcon, MoreHorizontal, CheckCircle2, XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardShell, formatRelativeTime } from "@/components/admin/dashboard-shell";

type BlogDoc = Record<string, unknown>;

export default function BlogListPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";

  const [blogs, setBlogs] = React.useState<BlogDoc[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [deleteModal, setDeleteModal] = React.useState<BlogDoc | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  async function fetchBlogs() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("filter", filter);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/blogs?${params.toString()}`);
      const result = await res.json();
      if (result.success) setBlogs(result.data);
      else setError(result.message || "Failed to load blogs.");
    } catch {
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { fetchBlogs(); }, [filter]);

  async function handleStatusToggle(blog: BlogDoc, newStatus: string) {
    setActionLoading(blog.id as string);
    try {
      await fetch(`/api/admin/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...blog, status: newStatus, featuredImage: blog.coverImage || blog.featuredImage || "" }),
      });
      await fetchBlogs();
    } catch { /* ignore */ } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete() {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      await fetch(`/api/admin/blogs/${deleteModal.id}`, { method: "DELETE" });
      setDeleteModal(null);
      await fetchBlogs();
    } catch { /* ignore */ } finally {
      setDeleteLoading(false);
    }
  }

  const publishedCount = blogs.filter((b) => b.status === "published").length;
  const draftCount = blogs.filter((b) => b.status === "draft").length;
  const totalViews = blogs.reduce((sum, b) => sum + (Number(b.views) || 0), 0);

  function statusBadge(status: unknown) {
    const s = String(status || "");
    if (s === "published") return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400"><CheckCircle2 className="h-3 w-3" />Published</span>;
    if (s === "draft") return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400"><Edit3 className="h-3 w-3" />Draft</span>;
    return <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/10 px-2 py-0.5 text-[11px] font-medium text-gray-400"><XCircle className="h-3 w-3" />Archived</span>;
  }

  return (
    <DashboardShell activeView="blogs">
      <div className="space-y-6 px-3 py-4 sm:px-4 lg:p-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Blog Management</h1>
            <p className="text-sm text-[#888]">Create, edit, and manage blog posts</p>
          </div>
          <button
            onClick={() => router.push(`/${slug}/dashboard/blogs/new`)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2.5 text-sm font-semibold text-[#D4AF37] transition-all hover:bg-[#D4AF37]/20"
          >
            <Plus className="h-4 w-4" />
            Create Blog
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Blogs", value: blogs.length, color: "text-white" },
            { label: "Published", value: publishedCount, color: "text-emerald-400" },
            { label: "Drafts", value: draftCount, color: "text-amber-400" },
            { label: "Total Views", value: totalViews.toLocaleString(), color: "text-sky-400" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-2xl font-semibold tracking-tight text-white">{stat.value}</p>
              <p className="mt-0.5 text-xs text-[#666]">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Search + Filter */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchBlogs()}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#D4AF37]/30"
            />
          </div>
          <div className="flex gap-1.5">
            {["all", "published", "draft", "archived"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  filter === f ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "text-[#666] hover:bg-white/[0.04] hover:text-white"
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Blog Table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          {loading ? (
            <div className="px-3 sm:px-5 py-16 text-center text-sm text-[#555]">Loading blogs...</div>
          ) : error ? (
            <div className="px-3 sm:px-5 py-16 text-center text-sm text-red-400">{error}</div>
          ) : blogs.length === 0 ? (
            <div className="px-3 sm:px-5 py-16 text-center text-sm text-[#555]">No blogs found. Create your first blog post.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-3 sm:px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#555]">Image</th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#555]">Title</th>
                    <th className="hidden sm:table-cell px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#555]">Category</th>
                    <th className="hidden md:table-cell px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#555]">Status</th>
                    <th className="hidden lg:table-cell px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#555]">Author</th>
                    <th className="hidden lg:table-cell px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#555]">Published</th>
                    <th className="hidden lg:table-cell px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-[#555]">Views</th>
                    <th className="px-3 sm:px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-[#555]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {blogs.map((blog, i) => (
                    <motion.tr
                      key={blog.id as string}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-3 sm:px-5 py-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.04]">
                          {(blog.coverImage || blog.featuredImage) ? (
                            <img src={String(blog.coverImage || blog.featuredImage)} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-[#444]" />
                          )}
                        </div>
                      </td>
                      <td className="max-w-[200px] px-3 py-3">
                        <p className="truncate text-sm font-medium text-white">{String(blog.title || "")}</p>
                        <p className="truncate text-xs text-[#555]">{String(blog.excerpt || "").slice(0, 60)}</p>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-3">
                        <span className="inline-flex rounded-full bg-white/[0.04] px-2 py-0.5 text-[11px] text-[#888]">{String(blog.category || "")}</span>
                      </td>
                      <td className="hidden md:table-cell px-3 py-3">{statusBadge(blog.status)}</td>
                      <td className="hidden lg:table-cell px-3 py-3 text-sm text-[#888]">{String(blog.author || "")}</td>
                      <td className="hidden lg:table-cell px-3 py-3 text-sm text-[#666]">
                        {blog.publishedAt ? formatRelativeTime(String(blog.publishedAt)) : "-"}
                      </td>
                      <td className="hidden lg:table-cell px-3 py-3 text-right text-sm text-[#888]">{String(blog.views || "0")}</td>
                      <td className="px-3 sm:px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => router.push(`/${slug}/dashboard/blogs/edit/${blog.id}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#555] transition-colors hover:bg-white/[0.06] hover:text-white"
                            title="View / Edit"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {String(blog.status) === "published" ? (
                            <button
                              onClick={() => handleStatusToggle(blog, "draft")}
                              disabled={actionLoading === blog.id}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-500/60 transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                              title="Unpublish"
                            >
                              <EyeOff className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusToggle(blog, "published")}
                              disabled={actionLoading === blog.id}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-500/60 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                              title="Publish"
                            >
                              <Globe className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteModal(blog)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteModal(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 mx-auto">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="mt-4 text-center text-lg font-semibold text-white">Delete Blog Post</h3>
            <p className="mt-2 text-center text-sm text-[#888]">
              Are you sure you want to delete &ldquo;{String(deleteModal.title || "")}&rdquo;? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[#888] transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardShell>
  );
}
