
INSERT INTO foodapp.users VALUES ('gabri', 'prova', 'Gabriele', 'Cesa', 'via Benzoni 36', '12345678');
INSERT INTO foodapp.users VALUES ('pinco', 'prova', 'Pinco', 'Pallino', 'via Trento 25', '12345678');
INSERT INTO foodapp.users VALUES ('mario', 'password', 'Mario', 'Rossi', 'via Benzoni 36', '12345678');



INSERT INTO foodapp.dishes VALUES (0, 'pasta al pomodoro', 'Tipico piatto italiano', 'metti la pasta sul piatto insieme al sugo');
INSERT INTO foodapp.dishes VALUES (1, 'pasta al ragu', 'Tipico piatto italiano', 'metti la pasta sul piatto insieme al ragu');
INSERT INTO foodapp.dishes VALUES (2, 'tortelli di zucca', 'Tipico piatto italiano', null);
INSERT INTO foodapp.dishes VALUES (3, 'bistecca', 'Tipico piatto italiano', null);
INSERT INTO foodapp.dishes VALUES (4, 'pesce', 'Tipico piatto italiano', '');
INSERT INTO foodapp.dishes VALUES (5, 'fritto misto', 'Tipico piatto italiano', '');
INSERT INTO foodapp.dishes VALUES (6, 'insalata', 'Tipico piatto italiano', null);
INSERT INTO foodapp.dishes VALUES (7, 'patatine fritte', 'Tipico piatto italiano', null);
INSERT INTO foodapp.dishes VALUES (8, 'torta', 'Tipico piatto italiano', null);
INSERT INTO foodapp.dishes VALUES (9, 'macedonia', 'Tipico piatto italiano', null);




INSERT INTO foodapp.orders VALUES ('gabri', '2016-12-01', 0, 3, 6, null, 'domicilio');
INSERT INTO foodapp.orders VALUES ('pinco', '2016-12-01', 1, 4, 6, 8, 'mensa');
INSERT INTO foodapp.orders VALUES ('gabri', '2016-12-02', null, 5, 7, 9, 'mensa');
INSERT INTO foodapp.orders VALUES ('gabri', '2016-12-04', 2, null, 7, 8, 'domicilio');
INSERT INTO foodapp.orders VALUES ('gabri', '2016-12-07', 1, 3, null, null, 'domicilio');

--ON CONFLICT (username, date) DO UPDATE 
--SET	first = EXCLUDED.first, second = EXCLUDED.second, side = EXCLUDED.side, place = EXCLUDED.place



INSERT INTO foodapp.menu VALUES ('2016-12-01', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-01', 'primo', false, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-01', 'secondo', true, 4);
INSERT INTO foodapp.menu VALUES ('2016-12-01', 'secondo', false, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-01', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-01', 'dessert', true, 8);

INSERT INTO foodapp.menu VALUES ('2016-12-02', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-02', 'primo', false, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-02', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-02', 'secondo', false, 5);
INSERT INTO foodapp.menu VALUES ('2016-12-02', 'contorno', true, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-02', 'dessert', true, 8);
INSERT INTO foodapp.menu VALUES ('2016-12-02', 'dessert', false, 9);


INSERT INTO foodapp.menu VALUES ('2016-12-03', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-03', 'primo', false, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-03', 'secondo', true, 4);
INSERT INTO foodapp.menu VALUES ('2016-12-03', 'secondo', false, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-03', 'contorno', true, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-03', 'dessert', true, 9);
INSERT INTO foodapp.menu VALUES ('2016-12-03', 'dessert', false, 8);


INSERT INTO foodapp.menu VALUES ('2016-12-04', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-04', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-04', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-04', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-04', 'contorno', false, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-04', 'dessert', true, 9);


INSERT INTO foodapp.menu VALUES ('2016-12-05', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-05', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-05', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-05', 'contorno', true, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-05', 'contorno', false, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-05', 'dessert', true, 8);


INSERT INTO foodapp.menu VALUES ('2016-12-06', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-06', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-06', 'secondo', false, 4);
INSERT INTO foodapp.menu VALUES ('2016-12-06', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-06', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-06', 'dessert', true, 9);

INSERT INTO foodapp.menu VALUES ('2016-12-07', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-07', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-07', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-07', 'contorno', false, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-07', 'dessert', true, 9);
INSERT INTO foodapp.menu VALUES ('2016-12-07', 'dessert', false, 8);


INSERT INTO foodapp.menu VALUES ('2016-12-08', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-08', 'primo', false, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-08', 'secondo', true, 4);
INSERT INTO foodapp.menu VALUES ('2016-12-08', 'secondo', false, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-08', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-08', 'dessert', true, 8);

INSERT INTO foodapp.menu VALUES ('2016-12-09', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-09', 'primo', false, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-09', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-09', 'secondo', false, 5);
INSERT INTO foodapp.menu VALUES ('2016-12-09', 'contorno', true, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-09', 'dessert', true, 8);
INSERT INTO foodapp.menu VALUES ('2016-12-09', 'dessert', false, 9);


INSERT INTO foodapp.menu VALUES ('2016-12-10', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-10', 'primo', false, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-10', 'secondo', true, 4);
INSERT INTO foodapp.menu VALUES ('2016-12-10', 'secondo', false, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-10', 'contorno', true, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-10', 'dessert', true, 9);
INSERT INTO foodapp.menu VALUES ('2016-12-10', 'dessert', false, 8);


INSERT INTO foodapp.menu VALUES ('2016-12-11', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-11', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-11', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-11', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-11', 'contorno', false, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-11', 'dessert', true, 9);

INSERT INTO foodapp.menu VALUES ('2016-12-12', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-12', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-12', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-12', 'contorno', true, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-12', 'contorno', false, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-12', 'dessert', true, 8);

INSERT INTO foodapp.menu VALUES ('2016-12-13', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-13', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-13', 'secondo', false, 4);
INSERT INTO foodapp.menu VALUES ('2016-12-13', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-13', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-13', 'dessert', true, 9);

INSERT INTO foodapp.menu VALUES ('2016-12-14', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-14', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-14', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-14', 'contorno', false, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-14', 'dessert', true, 9);
INSERT INTO foodapp.menu VALUES ('2016-12-14', 'dessert', false, 8);


INSERT INTO foodapp.menu VALUES ('2016-12-15', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-15', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-15', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-15', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-15', 'contorno', false, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-15', 'dessert', true, 9);

INSERT INTO foodapp.menu VALUES ('2016-12-16', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-16', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-16', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-16', 'contorno', true, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-16', 'contorno', false, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-16', 'dessert', true, 8);

INSERT INTO foodapp.menu VALUES ('2016-12-17', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-17', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-17', 'secondo', false, 4);
INSERT INTO foodapp.menu VALUES ('2016-12-17', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-17', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-17', 'dessert', true, 9);

INSERT INTO foodapp.menu VALUES ('2016-12-18', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-18', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-18', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-18', 'contorno', false, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-18', 'dessert', true, 9);
INSERT INTO foodapp.menu VALUES ('2016-12-18', 'dessert', false, 8);


INSERT INTO foodapp.menu VALUES ('2016-12-19', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-19', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-19', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-19', 'contorno', false, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-19', 'dessert', true, 9);
INSERT INTO foodapp.menu VALUES ('2016-12-19', 'dessert', false, 8);


INSERT INTO foodapp.menu VALUES ('2016-12-20', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-20', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-20', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-20', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-20', 'contorno', false, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-20', 'dessert', true, 9);

INSERT INTO foodapp.menu VALUES ('2016-12-21', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-21', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-21', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-21', 'contorno', true, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-21', 'contorno', false, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-21', 'dessert', true, 8);

INSERT INTO foodapp.menu VALUES ('2016-12-22', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-22', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-22', 'secondo', false, 4);
INSERT INTO foodapp.menu VALUES ('2016-12-22', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-22', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-22', 'dessert', true, 9);

INSERT INTO foodapp.menu VALUES ('2016-12-23', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-23', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-23', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-23', 'contorno', false, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-23', 'dessert', true, 9);
INSERT INTO foodapp.menu VALUES ('2016-12-23', 'dessert', false, 8);

INSERT INTO foodapp.menu VALUES ('2016-12-24', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-24', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-24', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-24', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-24', 'contorno', false, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-24', 'dessert', true, 9);

INSERT INTO foodapp.menu VALUES ('2016-12-25', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-25', 'primo', true, 0);
INSERT INTO foodapp.menu VALUES ('2016-12-25', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-25', 'contorno', true, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-25', 'contorno', false, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-25', 'dessert', true, 8);

INSERT INTO foodapp.menu VALUES ('2016-12-26', 'primo', true, 2);
INSERT INTO foodapp.menu VALUES ('2016-12-26', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-26', 'secondo', false, 4);
INSERT INTO foodapp.menu VALUES ('2016-12-26', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-26', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-26', 'dessert', true, 9);

INSERT INTO foodapp.menu VALUES ('2016-12-27', 'primo', true, 1);
INSERT INTO foodapp.menu VALUES ('2016-12-27', 'secondo', true, 3);
INSERT INTO foodapp.menu VALUES ('2016-12-27', 'contorno', true, 6);
INSERT INTO foodapp.menu VALUES ('2016-12-27', 'contorno', false, 7);
INSERT INTO foodapp.menu VALUES ('2016-12-27', 'dessert', true, 9);
INSERT INTO foodapp.menu VALUES ('2016-12-27', 'dessert', false, 8);



