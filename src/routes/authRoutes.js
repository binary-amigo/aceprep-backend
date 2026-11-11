const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { sign } = require("../auth/jwt");
const { verifyGoogleCredential } = require("../auth/google");
const { jwtSecret, jwtTtlSeconds, googleClientId } = require("../config");
const requireAuth = require("../middleware/requireAuth");
const rateLimit = require("../middleware/rateLimit");

const router = express.Router();
const limiter = rateLimit({ windowMs: 60_000, max: 10 });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v) => (typeof v === "string" ? v.trim() : "");

function session(user) {
  return { token: sign({ sub: user._id.toString() }, jwtSecret, jwtTtlSeconds), user: user.toPublic() };
}

// POST /api/signup  { firstName, lastName, email, phone?, password, confirmPassword? }
router.post("/signup", limiter, async (req, res, next) => {
  try {
    const firstName = str(req.body.firstName);
    const lastName = str(req.body.lastName);
    const email = str(req.body.email).toLowerCase();
    const phone = str(req.body.phone);
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: "First name, email and password are required." });
    }
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: "Please enter a valid email address." });
    if (password.length < 8) return res.status(400).json({ message: "Use at least 8 characters for your password." });
    if (req.body.confirmPassword !== undefined && req.body.confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords don't match." });
    }

    if (await User.exists({ email })) {
      return res.status(409).json({ message: "An account with this email already exists. Try logging in." });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
    });
    return res.status(201).json(session(user));
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists. Try logging in." });
    }
    return next(err);
  }
});

// POST /api/login  { email, password }
router.post("/login", limiter, async (req, res, next) => {
  try {
    const email = str(req.body.email).toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email }).select("+password");
    if (user && !user.password && user.googleId) {
      return res.status(401).json({ message: "This account uses Google sign-in. Continue with Google instead." });
    }
    const ok = user && user.password && (await bcrypt.compare(password, user.password));
    if (!ok) return res.status(401).json({ message: "Invalid email or password." });

    return res.json(session(user));
  } catch (err) {
    return next(err);
  }
});

// POST /api/login/google  { credential }  (the ID token from Google's button)
router.post("/login/google", limiter, async (req, res, next) => {
  try {
    const profile = await verifyGoogleCredential(req.body.credential, googleClientId);
    if (!profile) return res.status(401).json({ message: "Google sign-in failed. Please try again." });

    let user = await User.findOne({ $or: [{ googleId: profile.googleId }, { email: profile.email }] });
    if (!user) {
      user = await User.create(profile);
    } else if (!user.googleId) {
      user.googleId = profile.googleId; // link Google to an existing email account
      if (!user.picture) user.picture = profile.picture;
      await user.save();
    }
    return res.json(session(user));
  } catch (err) {
    return next(err);
  }
});

// GET /api/me  (Authorization: Bearer <token>)
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: "Please log in." });
    return res.json({ user: user.toPublic() });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
