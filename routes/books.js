const {Book, validate} = require('../models/book'); 
const {Genre} = require('../models/genre');
const auth = require('../middleware/auth');
const seller = require('../middleware/isseller');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const books = await Book.find().sort('name');
  res.send(books);
});

router.post('/',[auth,seller], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const book = new Book({ 
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyPurchaseRate: req.body.dailyPurchaseRate
  });
  await book.save();
  
  res.send(book);
});

router.put('/:id',[auth,seller], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const book = await Book.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyPurchaseRate: req.body.dailyPurchaseRate
    }, { new: true });

  if (!book) return res.status(404).send('The Book with the given ID was not found.');
  
  res.send(book);
});

router.delete('/:id',[auth,seller], async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);

  if (!book) return res.status(404).send('The Book with the given ID was not found.');

  res.send(book);
});

router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).send('The Book with the given ID was not found.');

  res.send(book);
});

module.exports = router; 