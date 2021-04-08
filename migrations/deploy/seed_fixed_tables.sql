-- Deploy apotheose:seed_fixed_tables to pg

BEGIN;

DELETE FROM action_type;
DELETE FROM contract;
DELETE FROM type;


INSERT INTO action_type (name)
VALUES 
    ('Date d''envoi de candidature'), 
    ('Relance'), 
    ('Entretien'), 
    ('Réponse positive'), 
    ('Réponse négative'), 
    ('Date d''abandon');

INSERT INTO contract (name)
VALUES
    ('CDI'),
    ('CDD'),
    ('Stage'),
    ('Alternance'),
    ('Freelance');

INSERT INTO type (name)
VALUES
    ('Offre'),
    ('Candidature spontanée'),
    ('Autre');

COMMIT;
