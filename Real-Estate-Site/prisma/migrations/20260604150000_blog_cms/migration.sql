CREATE TYPE "BlogStatus" AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE "CommentStatus" AS ENUM ('pending', 'approved', 'rejected', 'archived');

CREATE TABLE "Blog" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "coverImage" TEXT NOT NULL,
  "coverImageAlt" TEXT,
  "imageMetadata" JSONB,
  "author" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "status" "BlogStatus" NOT NULL DEFAULT 'draft',
  "publishedAt" TIMESTAMP(3),
  "readTime" TEXT NOT NULL,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "canonicalUrl" TEXT,
  "views" INTEGER NOT NULL DEFAULT 0,
  "likes" INTEGER NOT NULL DEFAULT 0,
  "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
  "aiPrompt" TEXT,
  "relatedSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "newsletterId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");
CREATE INDEX "Blog_status_publishedAt_idx" ON "Blog"("status", "publishedAt");
CREATE INDEX "Blog_featured_status_idx" ON "Blog"("featured", "status");
CREATE INDEX "Blog_category_idx" ON "Blog"("category");
CREATE INDEX "Blog_views_idx" ON "Blog"("views");
CREATE INDEX "Blog_newsletterId_idx" ON "Blog"("newsletterId");

CREATE TABLE "BlogComment" (
  "id" TEXT NOT NULL,
  "blogId" TEXT NOT NULL,
  "authorName" TEXT NOT NULL,
  "authorEmail" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "status" "CommentStatus" NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "BlogComment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BlogComment_blogId_status_idx" ON "BlogComment"("blogId", "status");
CREATE INDEX "BlogComment_createdAt_idx" ON "BlogComment"("createdAt");

ALTER TABLE "BlogComment"
  ADD CONSTRAINT "BlogComment_blogId_fkey"
  FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
