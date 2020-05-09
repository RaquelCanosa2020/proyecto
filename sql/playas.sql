USE playas;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS beaches (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(50),
type ENUM ('urban', 'not urban', 'isolated'),
municipality VARCHAR (50),
utm VARCHAR(50),
description TINYTEXT,
start_time TIME,
end_time TIME,
capacity INT,
lifesaving BOOLEAN DEFAULT FALSE,
blue_flag BOOLEAN DEFAULT FALSE,
sea_conditions ENUM ('calm', 'medium', 'strong'),
bar_restaurant BOOLEAN DEFAULT FALSE,
toilet BOOLEAN DEFAULT FALSE,
showers BOOLEAN DEFAULT FALSE,
access ENUM ('easy', 'medium', 'difficult'),
disabled_access BOOLEAN DEFAULT FALSE,
public_transport BOOLEAN DEFAULT FALSE,
green_area BOOLEAN DEFAULT FALSE,
pets_area BOOLEAN DEFAULT FALSE,
sports BOOLEAN DEFAULT FALSE,
average_rating FLOAT,
creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS users (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
first_name VARCHAR (50),
last_name VARCHAR (50),
id_number VARCHAR (10) UNIQUE,
date_of_birth DATE,
email VARCHAR (50),
password VARCHAR (128),
nickname VARCHAR (50) DEFAULT 'anonymous',
country VARCHAR (50),
profile_picture VARCHAR (50),
creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS reservations (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
state ENUM ('reserved', 'paid', 'finished', 'cancelled'),
visit_date DATE,
visit_hour TIME,
number_of_places INT CHECK (number_of_places < 6),
fee_euros DECIMAL (2,1),
id_beach INT UNSIGNED,
id_user INT UNSIGNED,
FOREIGN KEY (id_beach) REFERENCES beaches (id),
FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE SET NULL,
creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS payments (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
code VARCHAR (50) UNIQUE,
payment_dayhour DATETIME,
entity VARCHAR(50),
user_name VARCHAR (50),
concept TINYTEXT,
total_euros DECIMAL (2,1),
credit_card_owner VARCHAR (50),
credit_card_number VARCHAR (20), 
credit_card_expire_date DATE, 
id_reservation INT UNSIGNED,
FOREIGN KEY (id_reservation) REFERENCES reservations (id),
creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS ratings (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
rating_value FLOAT,
comment TINYTEXT,
favorite_beach BOOLEAN DEFAULT FALSE,
type_of_visit ENUM ('family', 'friends', 'sports','others'),
id_reservation INT UNSIGNED,
FOREIGN KEY (id_reservation) REFERENCES reservations (id),
creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS photographs (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
link VARCHAR (50),
description VARCHAR (100),
id_beach INT UNSIGNED,
id_user INT UNSIGNED,
FOREIGN KEY (id_beach) REFERENCES beaches (id),
FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE SET NULL,
creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
SET FOREIGN_KEY_CHECKS = 1;

insert into beaches (name,type, municipality, utm, description, start_time, end_time, capacity, lifesaving, blue_flag, sea_conditions, bar_restaurant, toilet, showers, access, disabled_access, public_transport, green_area, pets_area, sports) values ('Pedra do Sal', 'not urban', 'Carballo', 'X: 527.707,00 Y: 4.794.398,00', 'Playa de rocas y arena incluida en la Red Natura 2.000, como muchas playas de la zona.', '9:00', '22:00', '500', '0','0', 'strong', '0', '0', '1', 'easy', '0','1','1','0','0');

insert into beaches (name, type, municipality, utm, description, start_time, end_time, capacity, lifesaving, blue_flag, sea_conditions, bar_restaurant, toilet, showers, access, disabled_access, public_transport,green_area, pets_area, sports) values ('Baldaio', 'isolated', 'Carballo','X: 525.956,00 Y: 4.793.913,00', 'Extensa playa de arena ubicada dentro del entorno natural de Marismas de Baldaio.', '9:00', '22:00', '400', '1','1', 'strong', '0', '1', '1', 'easy', '1','1','1','0','0');

insert into beaches (name, type, municipality, utm, description, start_time, end_time, capacity, lifesaving, blue_flag, sea_conditions, bar_restaurant, toilet, showers, access, disabled_access, public_transport,green_area, pets_area, sports) values ('Caion', 'urban', 'A Laracha', 'X: 531.665,00 Y: 4.795.970,00', 'Arenal muy concurrido prácticamente dentro del pueblo de Caión, muy tranquila para el baño y con unas aguas muy limpias.', '8:00', '23:00', '250', '1','1', 'calm', '1', '1', '1', 'easy', '1','1','1','0','1');

insert into beaches (name, type, municipality, utm, description, start_time, end_time, capacity, lifesaving, blue_flag, sea_conditions, bar_restaurant, toilet, showers, access, disabled_access, public_transport,green_area, pets_area, sports) values ('Barrañán', 'not urban', 'Arteixo', 'X: 536.396,00 Y: 4.795.450,00' , 'Playa natural de arena blanca y fina en un entorno natural constituido por el arenal, un complejo dunar y la zona de marisma. Orientada al norte y de fuerte oleaje; ideal para la práctica del surf.', '8:00', '23:00', '600', '1','1', 'strong', '1', '1', '1', 'easy', '1','1','1','0','1');

insert into beaches (name, type, municipality, utm, description, start_time, end_time, capacity, lifesaving, blue_flag, sea_conditions, bar_restaurant, toilet, showers, access, disabled_access, public_transport,green_area, pets_area, sports) values ('Ares', 'urban','Ares', 'X: 561.554,00 Y: 4.808.737,00' , 'Es la playa del nucleo urbano de Ares, tranquila y bien equipada. Con numerosos accesos para personas con movilidad reducida.', '8:00', '22:00', '200', '1', '0', 'calm', '1', '1', '1', 'easy', '1','1','0','1','0');

insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Naomi', 'Prestage', '2636044155', '1998-12-28', 'nprestage0@google.com', '4dc7c5ff3dc17184b3ad84918573aa4fcfeecb21', 'nprestage0', 'Russia', 'd/profile/836648');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Roxana', 'Jeaneau', '7473557462', '1957-09-26', 'rjeaneau1@ameblo.jp', '2e6adc26224f460975827b045aad1098c2841ea2', 'rjeaneau1', 'Colombia', 'd/profile/819435');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Enid', 'Darrach', '1080772695', '1942-05-15', 'edarrach2@cam.ac.uk', '08531ddb6fd74339046bc91cdedbafbc345d577b', 'edarrach2', 'China', 'd/profile/701751');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Ricky', 'Finden', '5413574872', '1948-02-04', 'rfinden3@comcast.net', '92c0411aad45cd47b277fd95b51d07c89ac6a611', 'rfinden3', 'Croatia', 'd/profile/754765');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Verna', 'Renols', '4327233290', '1992-09-28', 'vrenols4@odnoklassniki.ru', '5df604205941f08b22d2e7bc13a5ec345c2c8472', 'vrenols4', 'France', 'd/profile/093039');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Melita', 'Simone', '9096138439', '1970-09-06', 'msimone5@sfgate.com', '9d7b3c535daf6bb41bca550f2e932be9c3ec001b', 'msimone5', 'Indonesia', 'd/profile/391495');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Delora', 'Clues', '8709016301', '1961-10-29', 'dclues6@forbes.com', '0dd8a88dea958a7586070eeec26b4afdfb6c46fe', 'dclues6', 'Greece', 'd/profile/385489');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Aindrea', 'Spriggin', '4927172937', '2001-11-18', 'aspriggin7@biglobe.ne.jp', 'd7a1b64444373bd8c8b34df491bf25f2ca6f373e', 'aspriggin7', 'Kenya', 'd/profile/606147');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Sarah', 'Warde', '7329231773', '1980-10-04', 'swarde8@google.co.uk', 'ab73d83ac8edee55f5fc0946ce08e2732d2c03e2', 'swarde8', 'China', 'd/profile/765277');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Godart', 'Banker', '4680229746', '1960-05-16', 'gbanker9@parallels.com', '55a62b8ad3f343b432dee2bb70b6a5de5e222019', 'gbanker9', 'Portugal', 'd/profile/491115');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Yetty', 'Konmann', '7203586715', '1974-06-29', 'ykonmanna@artisteer.com', '138bc7478bea375415db8e8341bb2bb97d52e1e9', 'ykonmanna', 'Bulgaria', 'd/profile/078699');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Tiena', 'Brushfield', '3536252792', '1951-06-04', 'tbrushfieldb@creativecommons.org', '6bc8a9892fc2e6963293c03ef07b8c5df65dc1c5', 'tbrushfieldb', 'Portugal', 'd/profile/366500');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Lazar', 'Clowsley', '3682959986', '1948-12-16', 'lclowsleyc@jigsy.com', '1337935c2ae224d35ba18371d323ff51984d1fd3', 'lclowsleyc', 'Indonesia', 'd/profile/783551');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Inglebert', 'Buckston', '7790578954', '1974-02-01', 'ibuckstond@nyu.edu', '4057450347b0bf38ea0c4c4a0dfc833e1cd1147d', 'ibuckstond', 'France', 'd/profile/028016');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Georas', 'Woodstock', '2611496939', '1951-05-17', 'gwoodstocke@geocities.jp', '2f075712d31a38792db8b1b1867967327d821584', 'gwoodstocke', 'Sri Lanka', 'd/profile/440425');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Lira', 'Pickless', '8779369131', '1992-02-23', 'lpicklessf@1688.com', '47c8104213592f4c13d539697d4fe68b606a73d0', 'lpicklessf', 'Thailand', 'd/profile/288730');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Vilhelmina', 'Coling', '2329265376', '1985-11-20', 'vcolingg@pinterest.com', '5df9fae742f21cc896edc6000abda7b1e84075e9', 'vcolingg', 'China', 'd/profile/174572');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Christan', 'Imeson', '2034248140', '1963-12-08', 'cimesonh@ucsd.edu', '9172abbe6938765996c5c53c79ea25a85b69c3aa', 'cimesonh', 'Czech Republic', 'd/profile/684000');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Christye', 'D''Alesio', '8816422184', '1967-02-26', 'cdalesioi@vk.com', 'c1043eda6ff375c5f05ca61de81c1ae1f8616021', 'cdalesioi', 'Czech Republic', 'd/profile/421398');
insert into users (first_name, last_name, id_number, date_of_birth, email, password, nickname, country, profile_picture) values ('Thorstein', 'Axon', '0260858734', '1965-05-22', 'taxonj@wp.com', '4549c4e8f556ec4493e6202f9a6020ad8d207c1d', 'taxonj', 'Portugal', 'd/profile/116793');

insert into reservations (state, visit_date, visit_hour, number_of_places, fee_euros, id_beach, id_user) values ('reserved', '2020/08/12', 19, 1, 3, 3, 19);
insert into reservations (state, visit_date, visit_hour, number_of_places, fee_euros, id_beach, id_user) values ('reserved', '2020/08/18', 11, 4, 3, 2, 12);
insert into reservations (state, visit_date, visit_hour, number_of_places, fee_euros, id_beach, id_user) values ('finished', '2019/08/21', 20, 2, 3, 5, 5);
insert into reservations (state, visit_date, visit_hour, number_of_places, fee_euros, id_beach, id_user) values ('finished', '2019/08/10', 19, 4, 3, 3, 9);
insert into reservations (state, visit_date, visit_hour, number_of_places, fee_euros, id_beach, id_user) values ('paid', '2020/08/07', 13, 4, 3, 5, 15);
insert into reservations (state, visit_date, visit_hour, number_of_places, fee_euros, id_beach, id_user) values ('paid', '2020/08/09', 21, 2, 3, 1, 3);
insert into reservations (state, visit_date, visit_hour, number_of_places, fee_euros, id_beach, id_user) values ('cancelled', '2019/08/06', 19, 2, 3, 5, 12);
insert into reservations (state, visit_date, visit_hour, number_of_places, fee_euros, id_beach, id_user) values ('finished', '2019/08/19', 18, 2, 3, 4, 20);
insert into reservations (state, visit_date, visit_hour, number_of_places, fee_euros, id_beach, id_user) values ('finished', '2019/08/02', 11, 2, 3, 2, 9);
insert into reservations (state, visit_date, visit_hour, number_of_places, fee_euros, id_beach, id_user) values ('paid', '2020/08/02', 21, 4, 3, 1, 6);

insert into payments (code, payment_dayhour, user_name, concept, total_euros, credit_card_owner, credit_card_number, credit_card_expire_date, id_reservation) values ('R-561475', '2019-07-22 07:55:59', 'Drusilla Fyndon', 'Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.', 3, 'Paulette Noor', '491191953023624562', '2022/01/06', 3);
insert into payments (code, payment_dayhour, user_name, concept, total_euros, credit_card_owner, credit_card_number, credit_card_expire_date, id_reservation) values ('R-305454', '2019-07-22 03:08:43', 'Lanna Andresen', 'Nunc rhoncus dui vel sem.', 3, 'Cordy Beldam', '3557458119743574', '2021/09/20', 5);
insert into payments (code, payment_dayhour, user_name, concept, total_euros, credit_card_owner, credit_card_number, credit_card_expire_date, id_reservation) values ('R-082347', '2019-07-22 08:53:11', 'Kory Mantz', 'Vestibulum sed magna at nunc commodo placerat.', 3, 'Roxana Izakoff', '6771345392763689', '2021/08/04', 10);
insert into payments (code, payment_dayhour, user_name, concept, total_euros, credit_card_owner, credit_card_number, credit_card_expire_date, id_reservation) values ('R-556091', '2019-07-19 18:38:11', 'Gabi Jakeman', 'Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.', 3, 'Nert Cuppitt', '5435162357261546', '2021/12/01', 4);
insert into payments (code, payment_dayhour, user_name, concept, total_euros, credit_card_owner, credit_card_number, credit_card_expire_date, id_reservation) values ('R-590380', '2019-07-25 18:55:50', 'Skippy Meugens', 'Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.', 3, 'Golda Wilds', '3585660613985678', '2022/03/10', 6);
insert into payments (code, payment_dayhour, user_name, concept, total_euros, credit_card_owner, credit_card_number, credit_card_expire_date, id_reservation) values ('R-247306', '2019-07-26 08:28:30', 'Griffin Baiden', 'Maecenas tincidunt lacus at velit.', 3, 'Gardie Thomel', '4508121546340533', '2022/01/16', 8);
insert into payments (code, payment_dayhour, user_name, concept, total_euros, credit_card_owner, credit_card_number, credit_card_expire_date, id_reservation) values ('R-110237', '2019-07-27 21:52:10', 'Celestine Woollin', 'Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.', 3, 'Morgana Tonry', '4905182552685219152', '2021/11/08', 7);
insert into payments (code, payment_dayhour, user_name, concept, total_euros, credit_card_owner, credit_card_number, credit_card_expire_date, id_reservation) values ('R-640978', '2019-07-21 06:50:19', 'Janean Borrill', 'In hac habitasse platea dictumst.', 3, 'Lorettalorna Kemball', '4508511853963051', '2021/05/28', 9);

insert into ratings (rating_value, comment, favorite_beach, type_of_visit, id_reservation) values (4.2, 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa.', true, 'friends', 4);
insert into ratings (rating_value, comment, favorite_beach, type_of_visit, id_reservation) values (3.0, 'Nulla ut erat id mauris vulputate elementum.', false, 'family', 3);
insert into ratings (rating_value, comment, favorite_beach, type_of_visit, id_reservation) values (3.5, 'Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum.', true, 'family', 8);
insert into ratings (rating_value, comment, favorite_beach, type_of_visit, id_reservation) values (2.2, 'Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat.', true, 'family', 9);

insert into photographs (link, description, id_beach, id_user) values ('D/pictures/33021', 'Nam dui.', 5, 2);
insert into photographs (link, description, id_beach, id_user) values ('D/pictures/51032', 'In sagittis dui vel nisl.', 3, 6);
insert into photographs (link, description, id_beach, id_user) values ('D/pictures/47944', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', 4, 13);
insert into photographs (link, description, id_beach, id_user) values ('D/pictures/76767', 'Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.', 5, 8);
insert into photographs (link, description, id_beach, id_user) values ('D/pictures/29204', 'Morbi vel lectus in quam fringilla rhoncus.',1 , 9);
insert into photographs (link, description, id_beach, id_user) values ('D/pictures/92391', 'Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.', 2, 11);
insert into photographs (link, description, id_beach, id_user) values ('D/pictures/89179', 'Nulla ut erat id mauris vulputate elementum.', 4, 6);
