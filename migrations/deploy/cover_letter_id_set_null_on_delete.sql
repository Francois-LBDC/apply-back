-- Deploy apotheose:cover_letter_id_set_null_on_delete to pg

BEGIN;

ALTER TABLE application
DROP CONSTRAINT application_cover_letter_id_fkey;

ALTER TABLE application
ADD CONSTRAINT cover_letter_id_fk
FOREIGN KEY (cover_letter_id) 
REFERENCES cover_letter(id)
ON DELETE SET NULL;

COMMIT;
