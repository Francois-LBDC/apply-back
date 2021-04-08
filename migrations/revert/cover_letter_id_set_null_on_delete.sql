-- Revert apotheose:cover_letter_id_set_null_on_delete from pg

BEGIN;

ALTER TABLE application
DROP CONSTRAINT cover_letter_id_fk;

ALTER TABLE application
ADD CONSTRAINT application_cover_letter_id_fkey
FOREIGN KEY (cover_letter_id)
REFERENCES cover_letter(id);

COMMIT;
