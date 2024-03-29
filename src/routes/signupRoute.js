const express = require("express");
require("dotenv").config();
const app = express();
const bcrypt = require("bcrypt");

const router = express.Router();
app.use(express.json());

const User = require("../models/user"); // Assuming you have a Mongoose model for users

// Mongoose will handle the connection internally, no need to create a new MongoClient instance

const uri = process.env.MONGODB_URI;

router.post("/signup", async (req, res) => {
  console.log(req.body.firstName);
  const userData = req.body;

  if (
    !userData.firstName ||
    !userData.lastName ||
    !userData.email ||
    !userData.phone ||
    !userData.password ||
    !userData.confirmPassword
  ) {
    return res.status(400).send("Please fill in all required fields.");
  }

  if (userData.password !== userData.confirmPassword) {
    return res.status(400).send("Passwords do not match.");
  }

  // Replace with actual user creation logic using your database/user management system
  // This is a placeholder for security reasons (not storing passwords in plain text)
  try {
    // await createNewUser(newUser); // Replace with your database interaction logic
    // ...

    const password = userData.password;
    let hashedPassword = "";

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw err;
        hashedPassword = hash;

        console.log(hashedPassword);
        const newUser = new User({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          password: hashedPassword, // Placeholder for hashed password
        });

        await newUser.save(); // Save the new user to the database
      });
    });

    // ...
    res.status(201).send("Signup successful!");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred during signup. Please try again later.");
  }
});

module.exports = router;

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
