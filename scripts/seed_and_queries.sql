USE cospace;

INSERT INTO teams (id, name, department)
VALUES 
(1, 'Accounting', 'Finance'),
(2, 'Recruitment', 'People services'),
(3, 'Data Science', 'D&D'),
(4, 'AED', 'D&D');

INSERT INTO users (id, first_name, last_name, email, role, password, team_id)
VALUES
(1,'James', 'Lebron', 'james.lebron@paconsulting.com', 'employee', 'password', 1),
(2, 'Stephen', 'Curry', 'stephen.curry@paconsulting.com', 'employee', 'password', 2),
(3, 'Joel', 'Embiid', 'joel.embiid@paconsulting.com', 'employee', 'password', 3),
(4, 'Micheal', 'Jordan', 'micheal.jordan@paconsulting.com', 'employee', 'password', 1),
(5, 'Dennis', 'Rodman', 'dennis.rodman@paconsulting.com', 'employee', 'password', 2),
(6, 'Scottie', 'Pippen', 'scottie.pippen@paconsulting.com', 'employee', 'password', 3),
(7, 'Larry', 'Bird', 'larry.bird@paconsulting.com', 'employee', 'password', 1),
(8, 'Lamelo', 'Ball', 'lamelo.ball@paconsulting.com', 'employee', 'password', 2);

INSERT INTO rooms (id, name, floor, capacity)
VALUES
(1, 'London', 1, 5),
(2, 'Sydney', 5, 10),
(3, 'Budapest', 3, 3);

INSERT INTO desks (id, name, floor)
VALUES
(1, 'DESK1', 1),
(2, 'DESK2', 2),
(3, 'DESK3', 3),
(4, 'DESK4', 4);

INSERT INTO bookings (id, user_id, desk_id, booking_date)
VALUES
(1, 1, 1, '2026-09-18'),
(2, 2, 2, '2026-09-19'),
(3, 3, 2, '2026-09-20'),
(4, 4, 3, '2026-09-21'),
(5, 5, 4, '2026-09-22'),
(6, 6, 1, '2026-09-23');
