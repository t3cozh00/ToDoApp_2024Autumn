import { selectAllTasks, insertTask, removeTask } from "../models/Task.js";
import { emptyOrRows } from "../helpers/utils.js";

const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id; // get user id from token
    const result = await selectAllTasks(userId);
    console.log("User ID:", userId, "in getTasks method");
    //console.log("Retrieved Tasks:", result, "in getTasks method");
    return res.status(200).json(emptyOrRows(result));
  } catch (error) {
    return next(error);
  }
};

const postTask = async (req, res, next) => {
  try {
    if (!req.body.description || req.body.description.length === 0) {
      const error = new Error("Invalid description for task");
      error.statusCode = 400;
      return next(error);
    }
    const userId = req.user.id;
    const userEmail = req.user.email;
    console.log("User ID:", userId, "in TaskController.js");
    console.log("User Email:", userEmail, "in TaskController.js");

    const result = await insertTask(req.body.description, userId, userEmail);
    return res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await removeTask(id);
    return res.status(200).json({ id: id });
  } catch (error) {
    return next(error);
  }
};

export { getTasks, postTask, deleteTask };
