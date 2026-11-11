const express = require("express");
const InterviewQuestion = require("../models/interviewQuestion");

const router = express.Router();

// GET /api/mockInterview?role=Frontend%20Developer  (role is optional)
router.get("/mockInterview", async (req, res, next) => {
  try {
    const filter = typeof req.query.role === "string" && req.query.role ? { jobRole: req.query.role } : {};
    res.json(await InterviewQuestion.find(filter).lean());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
