-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "extendedPetsData" JSONB,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
