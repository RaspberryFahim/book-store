const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/sellers',  async (req, res) => {
  const user = await User.find({isSeller:true}).select('-password');
  res.send(user);
});
router.get('/buyers',  async (req, res) => {
  const user = await User.find({isSeller:false}).select('-password');
  res.send(user);
});
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});



router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(11);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  //.send(_.pick(user, ['_id', 'name', 'email']))
  res.header('x-auth-token', token);
  res.send(token)
});

module.exports = router; 
