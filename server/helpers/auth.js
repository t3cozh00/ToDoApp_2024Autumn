import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const authorizationRequired = "Authorization required";
const invalidCredentials = "Invalid credentials";

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.statusMessage = authorizationRequired;
    res.status(401).json({ message: authorizationRequired });
  } else {
    try {
      console.log("Generated token:", token, "in auth.js");

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = { id: decoded.id, email: decoded.email };
      console.log("Decoded user:", req.user, "in auth.js");
      next();
    } catch (err) {
      res.statusMessage = invalidCredentials;
      res.status(403).json({ message: invalidCredentials });
    }
  }
};

export { auth };
