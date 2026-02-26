-- MYSQL

CREATE DATABASE gids6081_db;

CREATE TABLE users(
    id SMALLINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    lastname VARCHAR(250)
);

CREATE TABLE tasks(
    id SMALLINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250) NOT NULL,
    priority BOOLEAN NOT NULL,
    user_id SMALLINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users(name, lastname) VALUES('Jose', 'Hernandez');
INSERT INTO tasks(name, description, priority, user_id) VALUES('Task One', 'Description', true, 1);
INSERT INTO tasks(name, description, priority, user_id) VALUES('Task Two', 'This is a description', true, 1);

--insertar 1 usuario
-- insertar 2 tareas

--POSTGRES

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    lastname VARCHAR(250) NOT NULL
);

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250) NOT NULL,
    priority bool NOT NULL,
    user_id INTEGER REFERENCES users(id)
);

--insertar 2 tareas 