const express = require('express');
const mongoose = require('./db.js'); // Assuming you have a db.js file for Mongoose setup
const interviewRoutes = require('./routes/interviewQuestionsRoutes');
const resourcesRoutes = require('./routes/resourcesRoutes');
const aiInterviewRoutes = require('./routes/aiInterviewRoutes');
const signupRoute = require('./routes/signupRoute');
const loginRoute = require('./routes/loginRoute');

const app = express();
app.use(express.json());

// Define your other routes or middleware as needed

// Use the interview routes
app.use('/api', interviewRoutes); // Adjust the base path '/api' as needed
app.use('/api', resourcesRoutes); // Adjust the base path '/api' as needed
app.use('/api',aiInterviewRoutes);
app.use('/api',signupRoute); // Adjust the base path '/api' as needed
app.use('/api',loginRoute)



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




