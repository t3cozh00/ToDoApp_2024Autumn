import fs from "fs";
import path from "path";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { pool } from "./db.js";

import dotenv from "dotenv";
dotenv.config();

const __dirname = import.meta.dirname;

const getToken = (id, email) => {
  return sign({ id, email }, process.env.JWT_SECRET_KEY);
};

const initializeTestDb = async () => {
  const sql = fs.readFileSync(path.resolve(__dirname, "../todo.sql"), "utf8");
  pool.query(sql);
};

const insertTestUser = async (email, password) => {
  const hashedPassword = await hash(password, 10);

  const result = await pool.query(
    "insert into account (email, password) values ($1, $2) returning id",
    [email, hashedPassword]
  );
  return result.rows[0].id;
};

export { initializeTestDb, insertTestUser, getToken };
