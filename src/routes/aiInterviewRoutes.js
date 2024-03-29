const express = require('express');
// const mongoose = require('./db.js');
require('dotenv').config();
const app = express();

const router = express.Router();
app.use(express.json());

const InterviewQuestion = require('../models/interviewQuestion'); // Assuming you have a Mongoose model for interview questions

// Mongoose will handle the connection internally, no need to create a new MongoClient instance

const uri = process.env.MONGODB_URI;

router.get('/aiInterview', async function (req, res) {
  // const { role } = req.body;
    res.send('aiInterview');
});

module.exports = router

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
