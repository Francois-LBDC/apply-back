BEGIN;

-- Use the the signup to create a user first 


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
('Dev web junior', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-15T08:46:50.419Z', 'Contact de mr XXX', 'Toulouse', 1, 9, 1, 5, 1),
('Dev Senior', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-15T08:46:50.419Z', 'Contact de mr XXX', 'Marseille', 1, 9, 1, 5, 1),
('Dev web Front', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-15T08:46:50.419Z', 'Contact de mr XXX', 'Toulon', 1, 9, 1, 5, 1),
('Dev web Back', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-15T08:46:50.419Z', 'Contact de mr XXX', 'Nantes', 1, 9, 1, 5,1),
('Dev web JS', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-15T08:46:50.419Z', 'Contact de mr XXX', 'Lille', 1, 9, 1, 5, 1),
('Dev', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 9, 1, 5, 1),
('Dev front', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 9, 1, 5, 1),
('Dev web', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 9, 1, 5, 1),
('Dev back', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 9, 1, 5, 1),
('Dev back', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 9, 1, 5, 1),
('Dev JS FS', 'https://www.qwant.com/', 'Missions : blablabla', '2021-03-04T08:46:50.419Z', 'Contact de mr XXX', 'Paris', 1, 9, 1, 5, 1);
;

-- action insert
INSERT INTO "action" (title, "date", action_type_id, application_id) 
VALUES 
('Candidature mail', '2021-03-01 20:44:52.134125-07', 1, 90),
('Relance RH', '2021-03-01 20:44:52.134125-07', 2, 91),
('Entretien M. Dupont', '2021-03-01 20:44:52.134125-07', 3, 92),
('Mail refus', '2021-03-01 20:44:52.134125-07', 5, 93),
('Envoi candi', '2021-03-01 20:44:52.134125-07', 1, 95),
('Relance CTO', '2021-03-01 20:44:52.134125-07', 2, 96),
('Entretien CTO', '2021-03-01 20:44:52.134125-07', 3, 97),
('Proposition d''embauche', '2021-03-01 20:44:52.134125-07', 5, 98),
('Relance CTO', '2021-03-02 20:44:52.134125-07', 2, 99),
('Entretien CTO', '2021-03-03 20:44:52.134125-07', 3, 99),
('Accepté CDI', '2021-03-07 20:44:52.134125-07', 4, 99),
('Candidature sur le site', '2021-03-01 20:44:52.134125-07', 1, 99);

COMMIT;