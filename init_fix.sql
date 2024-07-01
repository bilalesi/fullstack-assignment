CREATE TABLE public.fruit (
	id serial4  PRIMARY KEY NOT NULL,
	"name" varchar NULL,
	fruityvice_id int4 NULL
);

CREATE TABLE public."location" (
	id serial4 PRIMARY KEY NOT NULL,
	"name" varchar NULL,
	headcount varchar NULL
);

CREATE TABLE public.ledger (
	fruit_id INTEGER REFERENCES public.fruit(id) NOT NULL,
	location_id INTEGER REFERENCES public.location(id) NOT NULL,
	amount int4 NULL,
	"time" timestamptz NOT NULL,
	CONSTRAINT ledger_unique UNIQUE (fruit_id, location_id, time)
);


INSERT INTO public."fruit" ("name", "fruityvice_id") VALUES 
('Lime', 44),
('Tangerine', 77),
('Apple', 6),
('Mango', 27),
('Plum', 71),
('Pineapple', 10),
('Kiwi', 665),
('Pear', 4);

INSERT INTO public."location" ("name", "headcount") VALUES 
('Amsterdam', 200),
('Berlin', 100),
('Paris', 20),
('London', 50);

INSERT INTO public.ledger (fruit_id, location_id, amount, time)
SELECT
  floor(random() * 7 + 1)::int AS fruit_id,        -- Random fruit_id from 1 to 8
  floor(random() * 3 + 1)::int AS location_id,     -- Random location_id from 1 to 4
  (floor(random() * 10) - 3)::int AS amount,  -- Random amount from -1000 to 1000
  timestamp '2016-01-01 00:00:00' +
    random() * (extract(epoch from timestamp '2024-04-23 00:00:00' - timestamp '2016-01-01 00:00:00')) * interval '1 second'
    AS time                                        -- Random timestamp between 2016 and now
FROM generate_series(1, 500);    
