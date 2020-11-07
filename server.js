'use strict'

require('dotenv').config();  //first

//bring in our dependencies   //second

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const { request, response } = require('express');
const pg = require('pg');



//create our Port 
const PORT = process.env.PORT || 3000;

//start express application
const app = express();
app.use(cors());

// where server look for pages for browser
app.use(express.static('./public'));

//view engine
app.set('view engine', 'ejs');

//decode Post Data
app.use(express.urlencoded({ extended: true}));



//connect to our database
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));


//ROUTES
app.get('/error', errorHandler);
app.get('/', homeHandler);
app.get('/books/:id')



// ROUTE HANDLERS
function errorHandler(request, response, error){
  response.status(500).render('pages/error');
  console.log('Watching for errors on server.js');
}
//refactored route
function homeHandler(request, response){
const sql = 'SELECT * FROM books;'; 
client.query(sql)
.then(results => {
let bookQuery = results.rows;
response.render('pages/index', { results: bookQuery });
})
.catch(error => {
  console.log(error);
});

}

// search new.ejs route
app.get('/searches/new', (request, response)=>{
  response.render('pages/searches/new');
});

app.post('/searches', (request, response)=>{
  const search = request.body.title1;
  const authorTitle = request.body.search_query;
  let selection = request.body.search_query;
  if(selection === 'title'){
    selection += `:${search}`;
  }else {
    selection += `:${search}`;
  }
  console.log('selection', selection);

  const URL = `https://www.googleapis.com/books/v1/volumes?q=${selection}`;
  console.log('URL', URL);
  superagent.get(URL)
    .then(data => {
      let searchOutput = data.body.items.map(book => new Book(book)
      );
      response.status(200).render('pages/searches/show',{bookSearch: searchOutput});
    })
    .catch(error => {
      response.status(500).render('pages/error');
    });

});

//constructor function for Book

function Book(obj){
  this.author = (obj.volumeInfo.authors)?obj.volumeInfo.authors:"can'find route";
  this.title = (obj.volumeInfo.title)?obj.volumeInfo.title:"can'find route";
  this.desc = (obj.volumeInfo.description)?obj.volumeInfo.description: "can'find route";
  this.image = (obj.volumeInfo.imageLinks.thumbnail)? obj.volumeInfo.imageLinks.thumbnail:'https://i.imgur.com/J5LVHEL.jpg';
}

//Starting Server

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});

// app.get('/new', getForm);

// function getForm(request, response) =>{


// }