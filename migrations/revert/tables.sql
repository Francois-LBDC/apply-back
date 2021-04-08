-- Revert apotheose:tables from pg

BEGIN;

DROP TABLE action;

DROP TABLE action_type;

DROP TABLE application;

DROP TABLE cover_letter;

DROP TABLE company;

DROP TABLE contract;

DROP TABLE type;

COMMIT;
