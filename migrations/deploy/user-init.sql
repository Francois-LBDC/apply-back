-- Deploy apotheose:user-init to pg

BEGIN;

CREATE TABLE "user" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email text NOT NULL,
    "password" text NOT NULL
);

ALTER TABLE "user" 
ADD CONSTRAINT email_unique UNIQUE (email);

COMMIT;