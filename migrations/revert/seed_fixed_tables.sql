-- Revert apotheose:seed_fixed_tables from pg

BEGIN;

DELETE FROM type;
DELETE FROM contract;
DELETE FROM action_type;

COMMIT;
