-- Revert apotheose:user-init from pg

BEGIN;

ALTER TABLE "user"
DROP CONSTRAINT email_unique;

DROP TABLE "user";

COMMIT;
