

-- drop database InteractiveQ;
-- create database InteractiveQ;
CREATE DATABASE IF NOT EXISTS test_temp;

USE test_temp;

-- create table person(
-- 	user_id INT primary key auto_increment,
--     name varchar(120),
--     email varchar(120),
--     password varchar(120)
-- );

-- create table session_token(
-- 	id int,
--     token varchar(120) primary key,
--     expiry_date varchar(120),
--     foreign key (id) references Person(user_id)
-- );

-- create table room(
-- 	room_id INT primary key auto_increment,
--     room_name varchar(20),
--     is_ended boolean,
--     admin_id INT,
--     foreign key (admin_id) references person(user_id)
-- );

-- create table belong_to_room (
-- 	room_id INT,
--     user_id INT,
--     is_authenticated boolean,
--     is_exited boolean,
--     foreign key (user_id) references person(user_id),
--     foreign key (room_id) references room(room_id),
--     primary key (user_id, room_id)
-- );

-- create table message(
-- 	message_id int primary key auto_increment,
--     is_annonymous boolean,
--     is_poll boolean,
--     text varchar(120),
--     post_time timestamp default current_timestamp,
--     tag_id int,
--     user_id int,
--     room_id int,
--     is_deleted boolean,
--     foreign key (tag_id) references message (message_id),
--     foreign key (user_id) references person(user_id),
--     foreign key (room_id) references room(room_id)
-- );

-- create table poll_options (
-- 	opt_id int primary key auto_increment,
--     opt_text varchar(120),
--     message_id int,
--     foreign key (message_id) references message(message_id)
-- );

-- create table vote(
-- 	user_id int,
--     opt_id int, 
--     foreign key (opt_id) references poll_options(opt_id),
--     foreign key (user_id) references person(user_id)
-- );

-- insert into person value(1,'temp', 'temp@gmail.com', 'temp');

-- insert into session_token value(1,'temp','2024');

-- select * from person;
-- select * from session_token;



