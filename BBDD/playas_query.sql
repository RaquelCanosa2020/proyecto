USE playas;


-- incluyo Costas de Galicia como entidad emisora en todos los pagos
UPDATE payments
SET entity = 'Costas de Galicia';

-- compruebo los datos de los pagos:
SELECT code, payment_dayhour, entity, user_name, concept, total_euros, credit_card_number, credit_card_expire_date, id_reservation, creation_date
FROM payments;

-- usuarios con reserva pagada:

SELECT users.id, users.first_name, users.last_name
FROM users, reservations, payments
WHERE payments.id_reservation = reservations.id AND reservations.id_user = users.id;

-- usuarios con reserva pagada (según estado reserva):

SELECT users.id, users.first_name, users.last_name
FROM users, reservations
WHERE reservations.id_user = users.id AND (reservations.state = 'paid' OR reservations.state = 'finished' OR reservations.state = 'cancelled');

-- playas reservadas por el usuario id 15:
SELECT users.id, users.first_name, users.last_name, beaches.name, beaches.type  
FROM users, reservations, beaches
WHERE reservations.id AND reservations.id_user = users.id AND reservations.id_beach = beaches.id;

-- número reservas en cada playa:

SELECT beaches.name, COUNT(*) AS numero_reservas
FROM beaches, reservations
WHERE beaches.id = reservations.id_beach
GROUP BY beaches.id
ORDER BY numero_reservas DESC;


-- número plazas reservadas en una playa y fecha determinada:
SELECT SUM (number_of_places)
FROM reservations
WHERE id_beach = 3 AND reservations.visit_date = '2020-08-12';





-- baja de un usuario, pej id.15:

DELETE FROM users
WHERE id = 15;

SELECT first_name
FROM users
WHERE id = 15;

-- compruebo que no me elimina la reserva

SELECT id, state, id_beach, id_user
FROM reservations;

-- ver evaluaciones de playas

SELECT beaches.name, rating_value, comment, favorite_beach, type_of_visit, ratings.creation_date
FROM ratings, reservations, beaches
WHERE ratings.id_reservation = reservations.id AND reservations.id_beach = beaches.id;
 
-- playas de las que los usuarios han subido fotos

SELECT beaches.name, users.first_name, users.last_name, photographs.description, photographs.creation_date
FROM beaches, users, photographs
WHERE photographs.id_beach= beaches.id AND photographs.id_user = users.id;

-- buscar playas por criterios

SELECT beaches.name, type, municipality, utm, description, start_time, end_time, capacity
FROM beaches
WHERE lifesaving = 1 AND sea_conditions = 'calm' AND pets_area = 1;

ALTER TABLE beaches ADD available_places INT;

UPDATE beaches
set available_places = 87
WHERE beaches.name = 'Pedra do Sal';

ALTER TABLE users CHANGE id_number id_number VARCHAR (10) UNIQUE;

SELECT *
FROM beaches;

SELECT *
FROM reservations;

ALTER TABLE reservations CHANGE update_date update_date TIMESTAMP DEFAULT current_timestamp;

UPDATE reservations 
SET visit_hour = '11:00'
WHERE reservations.id = 11;

