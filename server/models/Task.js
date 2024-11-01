import { pool } from "../helpers/db.js";

const selectAllTasks = async (userId) => {
  return await pool.query("select * from task where user_id = $1", [userId]);
};

const insertTask = async (description, userId, userEmail) => {
  return await pool.query(
    "insert into task (description, user_id, user_email) values ($1, $2, $3) returning *",
    [description, userId, userEmail]
  );
};

const removeTask = async (id) => {
  return await pool.query("delete from task where id = $1", [id]);
};

export { selectAllTasks, insertTask, removeTask };
