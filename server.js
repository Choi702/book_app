'use strict'


// DEPENDENCIES
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const { request, response } = require('express');
const pg = require('pg');

// ENVIRONMENT
require('dotenv').config();

// CREATE PORT
const PORT = process.env.PORT || 3000;

// APPLICATION SETUP
const app = express();
app.use(cors());

// where server look for pages for browser
app.use(express.static('./public'));

//view engine
app.set('view engine', 'ejs');

//decode Post Data
app.use(express.urlencoded({ extended: true }));



//connect to our database
// const client = new pg.Client(process.env.DATABASE_URL);

const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  user: 'klace',
  password: 'gen2klr',
  database: 'books'
});

client.connect();
client.on('error', err => console.error(err));


//ROUTES
app.get('/', homeHandler);
app.get('/error', errorHandler);
app.get('/books/:id', viewHandler);
app.post('/books', addBookHandler);



// ROUTE HANDLERS
function errorHandler(request, response, error) {
  response.status(500).render('pages/error');
  console.log('Watching for errors on server.js');
}

function homeHandler(request, response) {
  const sql = 'SELECT * FROM books;';
  client.query(sql)
    .then(results => {
      let bookQuery = results.rows;
      response.render('pages/index', { books: bookQuery });
    })
    .catch(error => {errorHandler(request, response, error);});
}

function viewHandler(request, response) {
  const sqlView = `SELECT * FROM books WHERE id = ${request.params.id}`;
  client.query(sqlView)
    .then(results => {
      let bookView = results.rows[0];
      response.render('pages/searches/detail', { books: [bookView] });
    })
    .catch(error => {errorHandler(request, response, error);});
}

function addBookHandler(request, response) {
  const sqlAdd = `INSERT INTO books (author, title, isbn, img, descrip) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const params = [request.body.author, request.body.title, request.body.isbn, request.body.img, request.body.descrip];
  console.log('params', params);
  client.query(sqlAdd, params)
    .then(results => {
      let addBook = results.rows[0].id;
      response.redirect(`/books/${addBook}`);
    })
    .catch(error => {errorHandler(request, response, error);});
}


// search new.ejs route
app.get('/searches/new', (request, response) => {
  response.render('pages/searches/new');
});

app.post('/searches', (request, response) => {
  const search = request.body.title1;
  const authorTitle = request.body.search_query;
  let selection = request.body.search_query;
  if (selection === 'title') {
    selection += `:${search}`;
  } else {
    selection += `:${search}`;
  }

  const URL = `https://www.googleapis.com/books/v1/volumes?q=${selection}`;
  console.log('URL', URL);
  superagent.get(URL)
    .then(data => {
      let searchOutput = data.body.items.map(book => new Book(book)
      );
      // console.log('searchOutput', searchOutput);
      response.status(200).render('pages/searches/show', { books: searchOutput });
    })
    .catch(error => {errorHandler(request, response, error);});
});

//constructor function for Book

function Book(obj) {
  this.author = (obj.volumeInfo.authors) ? obj.volumeInfo.authors : "can'find route";
  this.title = (obj.volumeInfo.title) ? obj.volumeInfo.title : "can'find route";
  this.descrip = (obj.volumeInfo.description) ? obj.volumeInfo.description : "can'find route";
  this.img = (obj.volumeInfo.imageLinks.thumbnail) ? obj.volumeInfo.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
}

//Starting Server

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});

