const mongoose = require("mongoose");
const { mongoUri } = require("./config");

// One shared connection, reused across requests (and across invocations of
// the same warm serverless instance on Vercel).
let connecting = null;

function connect() {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);
  if (!mongoUri) return Promise.reject(new Error("MONGODB_URI is not set"));
  if (!connecting) {
    connecting = mongoose
      .connect(mongoUri, { serverSelectionTimeoutMS: 8000 })
      .then(() => mongoose.connection)
      .catch((err) => {
        connecting = null; // allow a retry on the next request
        throw err;
      });
  }
  return connecting;
}

module.exports = { connect };
