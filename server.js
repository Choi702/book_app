'use strict'

//bring in our dependencies

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const { response } = require('express');

require('dotenv').config();


//create our Port

const PORT = process.env.PORT || 3000;

//start express application
const app = express();
app.use(cors());

// where server look for pages for browser
// app.use(express.static('./public'));

//view engine
// app.set('view engine', 'ejs');

app.get('/', (request, response)=>{
  response.status(200).send('Hello World');
})

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
