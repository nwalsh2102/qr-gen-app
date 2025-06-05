-- CreateTable
CREATE TABLE "code" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "testField" TEXT,

    CONSTRAINT "code_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "code" ADD CONSTRAINT "code_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
