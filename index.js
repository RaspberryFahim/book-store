
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const genres = require('./routes/genres');

const books = require('./routes/books');
const purchases = require('./routes/purchases');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();



mongoose.connect('mongodb://localhost/book-store')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/books', books);
app.use('/api/purchases', purchases);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port =  3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));