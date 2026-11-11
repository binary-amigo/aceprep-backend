const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: "", trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    // Empty for accounts created with Google. Never returned by default.
    password: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true },
    picture: { type: String, default: "" },
  },
  { timestamps: true },
);

userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    picture: this.picture,
  };
};

// Keeps the existing "users" collection.
module.exports = mongoose.models.users || mongoose.model("users", userSchema);
