-- Deploy apotheose:seeding_for_tests to pg

BEGIN;

DELETE FROM "user";
DELETE FROM action;
DELETE FROM application;
DELETE FROM cover_letter;
DELETE FROM company;

INSERT INTO "user"(firstname, lastname, email, "password")
VALUES ('Francis', 'Test', 'test@test.fr', '$2b$10$oSU.ATvkMoj01yqxtEGhTeN4sdd23fu0gEWCoCv0rXD7Kq0JN792a');

INSERT INTO company("name")
VALUES('Google'), ('Facebook');

INSERT INTO cover_letter (content)
VALUES ('Madame, Monsieur, je suis motivé.');


--application insert
INSERT INTO application
    (title, 
    link, 
    offer_content,
    dunning_date,
    notes, 
    "location", 
    type_id,
    company_id,
    contract_id,
    cover_letter_id,
    user_id)
VALUES 
('Dev web junior', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-15T08:46:50.419Z', 'Contact de mr XXX', 'Toulouse', 1, 1, 1, 1, 1),
('Dev Senior', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-15T08:46:50.419Z', 'Contact de mr XXX', 'Marseille', 1, 1, 1, 1, 1),
('Dev web Front', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-15T08:46:50.419Z', 'Contact de mr XXX', 'Toulon', 1, 1, 1, 1, 1),
('Dev web Back', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-15T08:46:50.419Z', 'Contact de mr XXX', 'Nantes', 1, 1, 1, 1,1),
('Dev web JS', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-15T08:46:50.419Z', 'Contact de mr XXX', 'Lille', 1, 1, 1, 1, 1),
('Dev', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 1, 1, 1, 1),
('Dev front', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 1, 1, 1, 1),
('Dev web', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 1, 1, 1, 1),
('Dev back', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 1, 1, 1, 1),
('Dev back', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 1, 1, 1, 1),
('Dev JS FS', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 1, 1, 1, 1);
;

-- action insert
INSERT INTO "action" (title, "date", action_type_id, application_id) 
VALUES 
('Candidature mail', '2021-03-01 20:44:52.134125-07', 1, 2),
('Relance RH', '2021-03-01 20:44:52.134125-07', 2, 3),
('Entretien M. Dupont', '2021-03-01 20:44:52.134125-07', 3, 4),
('Mail refus', '2021-03-01 20:44:52.134125-07', 5, 5),
('Envoi candi', '2021-03-01 20:44:52.134125-07', 1, 7),
('Relance CTO', '2021-03-01 20:44:52.134125-07', 2, 8),
('Entretien CTO', '2021-03-01 20:44:52.134125-07', 3, 9),
('Proposition d''embauche', '2021-03-01 20:44:52.134125-07', 5, 10),
('Relance CTO', '2021-03-02 20:44:52.134125-07', 2, 11),
('Entretien CTO', '2021-03-03 20:44:52.134125-07', 3, 11),
('Accepté CDI', '2021-03-07 20:44:52.134125-07', 4, 11),
('Candidature sur le site', '2021-03-01 20:44:52.134125-07', 1, 11);

COMMIT;