// routes/properties.js
const express = require('express');
const Property = require('../models/Property');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/add', async (req, res) => {
  const newProperty = new Property({ ...req.body, sellerId: req.user.id });

  try {
    await newProperty.save();
    res.status(201).send('Property added successfully');
  } catch (error) {
    res.status(400).send('Error adding property');
  }
});

router.get('/seller', async (req, res) => {
  const properties = await Property.find({ sellerId: req.user.id });
  res.json(properties);
});

router.put('/update/:id', async (req, res) => {
  try {
    await Property.findByIdAndUpdate(req.params.id, req.body);
    res.send('Property updated successfully');
  } catch (error) {
    res.status(400).send('Error updating property');
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.send('Property deleted successfully');
  } catch (error) {
    res.status(400).send('Error deleting property');
  }
});

router.get('/all', async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  const properties = await Property.find(filters)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await Property.countDocuments(filters);

  res.json({
    properties,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  });
});

router.post('/like/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    property.likes += 1;
    await property.save();
    res.json({ likes: property.likes });
  } catch (error) {
    res.status(400).send('Error liking property');
  }
});

router.post('/interested/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    const seller = await User.findById(property.sellerId);
    const buyer = await User.findById(req.user.id);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    const mailOptionsToSeller = {
      from: 'your-email@gmail.com',
      to: seller.email,
      subject: 'Interested Buyer for Your Property',
      text: `Buyer Details: \nName: ${buyer.firstName} ${buyer.lastName}\nEmail: ${buyer.email}\nPhone: ${buyer.phoneNumber}`
    };

    const mailOptionsToBuyer = {
      from: 'your-email@gmail.com',
      to: buyer.email,
      subject: 'Seller Contact Details',
      text: `Seller Details: \nName: ${seller.firstName} ${seller.lastName}\nEmail: ${seller.email}\nPhone: ${seller.phoneNumber}`
    };

    await transporter.sendMail(mailOptionsToSeller);
    await transporter.sendMail(mailOptionsToBuyer);

    res.send('Interest noted and emails sent');
  } catch (error) {
    res.status(400).send('Error noting interest');
  }
});

module.exports = router;
