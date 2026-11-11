const { verify } = require("../auth/jwt");
const { jwtSecret } = require("../config");

module.exports = function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const payload = token && verify(token, jwtSecret);
  if (!payload) return res.status(401).json({ message: "Please log in." });
  req.userId = payload.sub;
  next();
};
