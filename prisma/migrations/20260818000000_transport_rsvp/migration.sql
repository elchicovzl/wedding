-- Replace previous-wedding RSVP fields with transport question
ALTER TABLE "Family" ADD COLUMN "needsTransport" BOOLEAN;
ALTER TABLE "Family" DROP COLUMN "drinkChoice";
ALTER TABLE "Family" DROP COLUMN "stayOvernight";
