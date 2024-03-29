const express = require('express');
// const mongoose = require('./db.js');
require('dotenv').config();
const app = express();
const cors = require('cors');

const router = express.Router();
app.use(express.json());

const resources = require('../models/resources'); // Assuming you have a Mongoose model for interview questions

// Mongoose will handle the connection internally, no need to create a new MongoClient instance

const uri = process.env.MONGODB_URI;

router.get('/resources', async function (req, res) {
  // const { role } = req.body;

  try {
    // Fetch questions from the database based on the role using Mongoose
    const resource = await resources.find();

    // Perform logic for mock interview based on the questions
    // ...
    console.log(resource)
    res.send(resource);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });




