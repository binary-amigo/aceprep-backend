const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({ firstName: { type: String, required: true }, 
                                      lastName: { type: String, required: true },
                                       email: { type: String, required: true }, 
                                       phone: { type: String, required: true }, 
                                       password: { type: String, required: true }, 
                                      });

// Add the userSchema to the resourcesSchema resourcesSchema.add(userSchema);

const users = mongoose.model('users', userSchema);

module.exports = users;
