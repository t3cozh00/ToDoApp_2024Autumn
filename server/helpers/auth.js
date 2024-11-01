import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const authorizationRequired = "Authorization required";
const invalidCredentials = "Invalid credentials";

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    res.statusMessage = authorizationRequired;
    res.status(401).json({ message: authorizationRequired });
  } else {
    try {
      const token = req.headers.authorization;
      //console.log("Generated token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = { id: decoded.id, email: decoded.email };
      console.log("Decoded user:", req.user);
      next();
    } catch (err) {
      res.statusMessage = invalidCredentials;
      res.status(403).json({ message: invalidCredentials });
    }
  }
};

export { auth };
