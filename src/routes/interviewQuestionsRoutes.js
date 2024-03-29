const express = require('express');
// const mongoose = require('./db.js');
require('dotenv').config();
const app = express();

const router = express.Router();
app.use(express.json());

const InterviewQuestion = require('../models/interviewQuestion'); // Assuming you have a Mongoose model for interview questions

// Mongoose will handle the connection internally, no need to create a new MongoClient instance

const uri = process.env.MONGODB_URI;

router.get('/mockInterview', async function (req, res) {
  // const { role } = req.body;

  try {
    // Fetch questions from the database based on the role using Mongoose
    const questions = await InterviewQuestion.find();

    // Perform logic for mock interview based on the questions
    // ...
    console.log(questions)
    res.send(questions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
