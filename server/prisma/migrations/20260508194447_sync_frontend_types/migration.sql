/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Voter` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `Voter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coordinator" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- AlterTable
ALTER TABLE "Voter" DROP COLUMN "birthDate",
DROP COLUMN "document",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "electoralSection" TEXT,
ADD COLUMN     "electoralZone" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "registrationSource" TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN     "supportStatus" TEXT NOT NULL DEFAULT 'gold',
ADD COLUMN     "voterRegistration" TEXT,
ADD COLUMN     "whatsapp" TEXT,
ALTER COLUMN "city" DROP NOT NULL;
