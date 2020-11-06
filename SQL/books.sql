DROP TABLE if exists searches/new;

CREATE TABLE searches/new (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn FLOAT,
  image_url VARCHAR(255),
  description VARCHAR(255)
);