const express = require('express');
const cors = require('cors'); // Enable CORS for frontend requests
const bodyParser = require('body-parser'); // Parse request body data
const bcrypt = require('bcrypt'); // Secure password hashing

const router = express.Router();

const app = express();
app.use(express.json());
app.use(cors());

// Use environment variable for port

// Enable CORS for all origins (adjust for production environments)

const User = require('../models/user');

// Parse JSON data from client requests

// Placeholder user data (replace with database integration)


// Google Login (replace with actual Google Login integration)
router.post('/login/google', async (req, res) => {
  try {
    const { token } = req.body;

    // Validate Google token (implement server-side validation)
    const validatedUser = await validateGoogleToken(token); // Replace with your validation logic

    if (!validatedUser) {
      return res.status(401).json({ message: 'Invalid Google login token' });
    }

    // Handle successful Google login (create or update user session)
    res.json({ success: true, message: 'Logged in with Google' }); // Replace with session management

  } catch (error) {
    console.error('/api/login/google error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Email/Password Login with secure password hashing
router.post('/login', async (req, res) => {
  try {
    const loginData = req.body;
    console.log(loginData)
    console.log(User)

    const foundUser =await User.findOne({email: loginData.email})
    console.log(foundUser)

    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(foundUser.password, loginData.password)
    const validPassword = await bcrypt.compare(loginData.password, foundUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Handle successful email/password login (create or update user session)
    res.json({ success: true, message: 'Logged in with email/password' }); // Replace with session management

  } catch (error) {
    console.error('/api/login/email error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Error handling middleware


// Placeholder function for Google token validation (replace with actual implementation)
async function validateGoogleToken(token) {
  // Implement server-side Google token validation logic here
  // (e.g., using Google's token verification API)
  return true; // Replace with actual validation
}

module.exports = router;