-- Revert apotheose:seeding_for_tests from pg

BEGIN;

DROP TABLE action;

DROP TABLE application;

DROP TABLE cover_letter;

DROP TABLE company;


CREATE TABLE company (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL
);

CREATE TABLE cover_letter (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content text NOT NULL,
    creation_date timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE application (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    creation_date timestamptz NOT NULL DEFAULT NOW(),
    title text NOT NULL,
    link text,
    offer_content text,
    dunning_date timestamptz,
    notes text,
    "location" text,
    type_id int NOT NULL REFERENCES type(id),
    company_id int REFERENCES company(id),
    contract_id int REFERENCES contract(id),
    cover_letter_id int REFERENCES cover_letter(id),
    user_id int NOT NULL REFERENCES "user"(id)
);

CREATE TABLE action(
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title text NOT NULL,
    "date" timestamptz NOT NULL,
    action_type_id int NOT NULL REFERENCES action_type(id),
    application_id int NOT NULL REFERENCES application(id)
);

COMMIT;