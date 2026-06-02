-- Add electoral data fields to coordinators
ALTER TABLE "Coordinator"
ADD COLUMN "voterRegistration" TEXT,
ADD COLUMN "pollingPlaceId" TEXT,
ADD COLUMN "electoralZone" TEXT,
ADD COLUMN "electoralSection" TEXT;

-- Link coordinator to polling place
ALTER TABLE "Coordinator"
ADD CONSTRAINT "Coordinator_pollingPlaceId_fkey"
FOREIGN KEY ("pollingPlaceId") REFERENCES "PollingPlace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
