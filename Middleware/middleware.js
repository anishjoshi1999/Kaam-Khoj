const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../utils/constants");
module.exports = {
  authMiddleware: async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/auth");
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.redirect("/auth");
      res.status(401).json({ message: "Unauthorized" });
    }
  },
};
