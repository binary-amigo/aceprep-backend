const express = require("express");
const Resource = require("../models/resources");

const router = express.Router();

// GET /api/resources
router.get("/resources", async (req, res, next) => {
  try {
    res.json(await Resource.find().lean());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
