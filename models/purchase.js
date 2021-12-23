const Joi = require('joi');
const mongoose = require('mongoose');

const Purchase = mongoose.model('Purchase', new mongoose.Schema({
  buyer: { 
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      
      email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
      }      
    }),  
    required: true
  },
  book: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      dailyPurchaseRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
    }),
    required: true
  },
  dateOut: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dateReturned: { 
    type: Date
  },
  purchaseFee: { 
    type: Number, 
    min: 0
  }
}));

function validatePurchase(purchase) {
  const schema = {
    buyerId: Joi.objectId().required(),
    bookId: Joi.objectId().required()
  };

  return Joi.validate(purchase, schema);
}

exports.Purchase = Purchase; 
exports.validate = validatePurchase;