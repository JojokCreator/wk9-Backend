import express from "express";
import jwt from "jsonwebtoken";
import { query } from "../db/index.js";
import bcrypt from "bcrypt";
import jwtTokens from "../utils/jwt-helpers.js";
const authRouter = express.Router();

//Route to Login
authRouter.post("/login", async (req, res) => {
  try {
    //Email check
    const { username, password } = req.body;
    const user = await query("SELECT * FROM users WHERE email = $1;", [
      username,
    ]);
    if (user.rows.length === 0)
      return res.status(401).json({ error: "Email address not found" });
    //Password Check
    console.log(user.rows);
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword)
      return res.status(401).json({ error: "Incorrect password" });
    // JSON Web Token
    let tokens = jwtTokens(user.rows[0]);
    res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

authRouter.get("/refresh_token", (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken === null)
      return res.status(401).json({ error: "null refresh token" });
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (error, user) => {
      if (error) return res.status(403).json({ error: error.message });
      let tokens = jwtTokens(user);
      res.cookie("refresh_token", tokens.refreshToken, { 
      httpOnly: true , 
      // domain: "https://front-end-bootcamper-social.netlify.app",
      secure: true,
      sameSite:'none',
    });
      res.json(tokens);
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

authRouter.delete("/refresh_token", (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "refresh token deleted" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default authRouter;
