DROP TABLE if exists books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  img VARCHAR(255),
  descrip VARCHAR(3000)
);