const {Purchase, validate} = require('../models/purchase'); 
const {Book} = require('../models/book'); 
const {User} = require('../models/user'); 
const auth = require('../middleware/auth');
const seller = require('../middleware/isseller');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const purchases = await Purchase.find().sort('-dateOut');
  res.send(purchases);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const buyer = await User.findById(req.body.buyerId);
  if (!buyer) return res.status(400).send('Invalid buyer.');

  const book = await Book.findById(req.body.bookId);
  if (!book) return res.status(400).send('Invalid Book.');

  if (book.numberInStock === 0) return res.status(400).send('Book not in stock.');

  let purchase = new Purchase({ 
    buyer: {
      _id: buyer._id,
      name: buyer.name, 
      phone: buyer.phone
    },
    book: {
      _id: book._id,
      title: book.title,
      dailyPurchaseRate: book.dailyPurchaseRate
    }
  });

  try {
    new Fawn.Task()
      .save('Purchases', purchase)
      .update('Books', { _id: book._id }, { 
        $inc: { numberInStock: -1 }
      })
      .run();
  
    res.send(purchase);
  }
  catch(ex) {
    res.status(500).send('Something failed.');
  }
});

router.get('/:id',[auth,seller], async (req, res) => {
  const purchase = await Purchase.findById(req.params.id);

  if (!purchase) return res.status(404).send('The Purchase with the given ID was not found.');

  res.send(purchase);
});

module.exports = router; 