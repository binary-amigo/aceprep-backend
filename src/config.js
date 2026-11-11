// All settings come from environment variables (see .env.example).
// Never hard-code credentials in this repo.
require("dotenv").config();

const list = (v) =>
  (v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

module.exports = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtTtlSeconds: Number(process.env.JWT_TTL_SECONDS) || 7 * 24 * 60 * 60,
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  // Comma-separated. "*" inside an entry matches one host label part, e.g.
  // https://aceprep-*-imran-khans-projects-bb3f275b.vercel.app for previews.
  corsOrigins: list(process.env.CORS_ORIGINS),
  isProduction: process.env.NODE_ENV === "production" || !!process.env.VERCEL,
};
