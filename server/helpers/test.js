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

  const email = "test44@foo.com";
  const password = "test4412345";
  // Use the modified insertTestUser to get the user ID
  const userId = await insertTestUser(email, password);

  const token = getToken(userId, email);
  console.log("Generated token:", token);

  // Insert tasks with user_id and user_email fields
  await pool.query(
    "INSERT INTO task (description, user_id, user_email) VALUES ($1, $2, $3)",
    ["My test task from test", userId, email]
  );
  await pool.query(
    "INSERT INTO task (description, user_id, user_email) VALUES ($1, $2, $3)",
    ["My another test task from test", userId, email]
  );
  // Confirm the tasks have been added
  const tasks = await pool.query("SELECT * FROM task");
  console.log("Tasks in database:", tasks.rows);
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
