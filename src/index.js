// AcePrep API. Vercel imports this file and uses the exported app;
// `npm start` runs it as a normal server.
const express = require("express");
const cors = require("cors");
const config = require("./config");
const { connect } = require("./db");
const { makeOriginCheck } = require("./auth/cors");

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewQuestionsRoutes");
const resourcesRoutes = require("./routes/resourcesRoutes");
const aiInterviewRoutes = require("./routes/aiInterviewRoutes");

const app = express();
app.set("trust proxy", 1); // real client IPs behind Vercel's proxy (rate limiting)
app.disable("x-powered-by");

const originAllowed = makeOriginCheck(config.corsOrigins, { allowLocalhost: !config.isProduction });
app.use(
  cors({
    origin: (origin, cb) => cb(null, originAllowed(origin)),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  }),
);
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => res.json({ name: "aceprep-api", status: "ok" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Every other /api route needs the database.
app.use("/api", async (req, res, next) => {
  try {
    await connect();
    next();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    res.status(503).json({ message: "Service temporarily unavailable. Please try again." });
  }
});

app.use("/api", authRoutes);
app.use("/api", interviewRoutes);
app.use("/api", resourcesRoutes);
app.use("/api", aiInterviewRoutes);

app.use((req, res) => res.status(404).json({ message: "Not found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON body." });
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

if (require.main === module) {
  app.listen(config.port, () => console.log(`AcePrep API on http://localhost:${config.port}`));
}

module.exports = app;
