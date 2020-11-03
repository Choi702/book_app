'use strict'

//bring in our dependencies

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const { request, response } = require('express');


require('dotenv').config();


//create our Port

const PORT = process.env.PORT || 3000;

//start express application
const app = express();
app.use(cors());

// where server look for pages for browser
app.use(express.static('./public'));

//decode Post Data
app.use(express.urlencoded({ extended: true}));

//view engine
app.set('view engine', 'ejs');

//ROUTES
app.get('/error', errorHandler);
app.get('/', homeHandler);

// ROUTE HANDLERS
function errorHandler(request, response, error){
  response.status(500).render('pages/error');
  console.log('Watching for errors on server.js');
}
function homeHandler(request, response){
  response.status(200).render('pages/index');
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
