import dotenv from "dotenv";
dotenv.config();
import { insertUser, selectUserByEmail } from "../models/User.js";
import { ApiError } from "../helpers/ApiError.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;

const createUserObject = (id, email, token = undefined) => {
  return {
    id: id,
    email: email,
    ...(token !== undefined && { token: token }), // Add token to object if it exists
  };
};

const postRegistration = async (req, res, next) => {
  try {
    console.log(
      "Registration request received:",
      req.body,
      "in userController.js"
    );
    if (!req.body.email || !req.body.email.length === 0) {
      throw new ApiError("Invalid email for user", 400);
    }
    if (!req.body.password || req.body.password.length < 8) {
      throw new ApiError("Invalid password for user", 400);
    }
    // hash the password and insert the user into the database
    const hashedPassword = await hash(req.body.password, 10);
    const userFromDb = await insertUser(req.body.email, hashedPassword);
    // console.log("User inserted into DB:", userFromDb);
    const user = userFromDb.rows[0];
    return res.status(201).json(createUserObject(user.id, user.email));
  } catch (error) {
    //console.error("Error in postRegistration:", error, "in userController.js");
    return next(error);
  }
};

const postLogin = async (req, res, next) => {
  const invalid_credentials_message = "Invalid credentials";
  try {
    const userFromDb = await selectUserByEmail(req.body.email);
    if (userFromDb.rowCount === 0)
      return next(new ApiError(invalid_credentials_message));

    const user = userFromDb.rows[0];

    if (!(await compare(req.body.password, user.password)))
      return next(new ApiError(invalid_credentials_message, 401));

    //console.log("User object before signing token:", user);

    const token = sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    //console.log("Generated token:", token);

    return res.status(200).json(createUserObject(user.id, user.email, token));
  } catch (error) {
    return next(error);
  }
};

export { postRegistration, postLogin };
