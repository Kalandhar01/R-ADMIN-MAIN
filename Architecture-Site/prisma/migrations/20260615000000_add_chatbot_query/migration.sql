CREATE TABLE "ChatbotQuery" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "pageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatbotQuery_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ChatbotQuery_createdAt_idx" ON "ChatbotQuery"("createdAt");
