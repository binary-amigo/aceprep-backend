const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  jobRole: { type: String, required: true },
  questionText: { type: String, required: true },
  sampleAnswer: { type: String, required: true },
});

const InterviewQuestion = mongoose.model('questions', interviewQuestionSchema);

module.exports = InterviewQuestion;
