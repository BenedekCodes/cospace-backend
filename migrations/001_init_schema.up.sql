use cospace;

CREATE TABLE if not exists teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL
);

CREATE TABLE if not exists rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    floor INT NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE if not exists users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100),
    password VARCHAR(255),
    team_id INT,

    FOREIGN KEY (team_id) REFERENCES teams(id)
        ON DELETE SET NULL
);

CREATE TABLE if not exists desks (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    floor INT NOT NULL
);

CREATE TABLE if not exists bookings (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    desk_id INT NOT NULL,
    booking_date DATE,
    active TINYINT DEFAULT 1,

    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (desk_id) REFERENCES desks(id)
        on DELETE CASCADE
);