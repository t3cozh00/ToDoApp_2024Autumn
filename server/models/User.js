import { pool } from "../helpers/db.js";

const insertUser = async (email, hashedpassword) => {
  return await pool.query(
    "insert into account (email, password) values ($1, $2) returning *",
    [email, hashedpassword]
  );
};

const selectUserByEmail = async (email) => {
  return await pool.query(
    "select id, email, password from account where email=$1",
    [email]
  );
};

export { insertUser, selectUserByEmail };
