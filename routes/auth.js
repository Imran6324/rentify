// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, userType } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).send('Email already exists');

    const newUser = new User({ firstName, lastName, email, phoneNumber, password: hashedPassword, userType });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(400).send('Invalid email or password');
  }

  const token = jwt.sign({ id: user._id, userType: user.userType }, 'your_jwt_secret');
  res.json({ token });
});

module.exports = router;
