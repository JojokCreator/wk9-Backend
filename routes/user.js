import express from "express";
import { body, validationResult } from "express-validator";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
} from "../models/user.js";




const usersRouter = express.Router();
//GET ALL USERS (GET)
usersRouter.get("/users", async (req, res) => {
  const result = await getUsers(); //models users
  res.json({ Success: true, Payload: result });
});

// //GET USER BY ID
usersRouter.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const result = await getUserById(id);
  res.json({ Success: true, Payload: result });
});

//CREATE A NEW USER (POST)
usersRouter.post(
  "/users",
  body("password")
    .isLength({ min: 5 })
    .withMessage("must be at least 5 chars long")
    .matches(/\d/)
    .withMessage("must contain a number"),
  body("email").isEmail().withMessage("must be an email address"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newUser = req.body;
    const result = await createUser(newUser);
    res.json({ Success: true, Payload: result });
  }
);

//UPDATE USER DETAILS (PATCH)
usersRouter.patch("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const updatedUser = req.body;
  const result = await updateUser(updatedUser, id);
  res.json({ Success: true, Payload: result });
});

//DELETE A USER (DELETE)

usersRouter.delete("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteUser(id);
  res.json({ Success: true, Payload: result });
});

export default usersRouter;
