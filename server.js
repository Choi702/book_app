'use strict'

//bring in our dependencies

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');


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

app.get('/hello', (request, response)=>{
  response.status(200).render('pages/index');})

// search new.ejs route
app.get('/searches/new', (request, response)=>{
  response.render('pages/searches/new');
})


app.post('/searches', (request, response)=>{
  const search = request.body.title1;
  const authorTitle = request.body.authorOrTitle;
  let urlAuthorTitle = '';
  if(authorTitle === 'title'){
    urlAuthorTitle = `intitle:${search}`;

  }else if (authorOrTitle === 'author') {
    urlAuthorTitle = `inauthor:${search}`;
  }

  const URL = `https://www.googleapis.com/books/v1/volumes?q=${urlAuthorTitle}`;
  superagent.get(URL)
  .then(data => {
    data.body.items.map(book =>{
    new Book(book.volumeInfo);
    })
    .then(book => response.render('pages/searches/show', { searchResults: book })); 
  }) 
})


//constructor function for Book

function Book(obj){
  this.author = obj.authors;
  this.title = obj.title;
  this.description = obj.description;
  this.image = obj.imageLinks;
  this.isbn = obj.industryIdentifiers.type;
  this.id = obj.id;
  const holderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  let imageLink = '';
 if(book.volumeInfo.imageLinks){
  imageLink = book.volumeInfo.imageLinks.thumbnail; 
 }else {
  return new Book(book, imageLink);
 }
  

}

//route handler

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});