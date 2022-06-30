import express from "express";
import jwt from "jsonwebtoken";
import usersRouter from "./routes/user.js";
import eventsRouter from "./routes/events.js";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";

const app = express();
//Middleware that parses the data
app.use(express.json());
app.use(cookieParser());

//Sets the port to 5000
const PORT = process.env.port || 5000;

//Serves images
app.use('/images', express.static('images'))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

//Mock user for JSON Web Token (JWT)
const users = [
  {
    id: "1",
    username: "admin",
    password: "admin",
  },
];

//Router middleware
app.use("/", usersRouter);
app.use("/", eventsRouter);
app.use("/", authRouter);

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);
    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      req.user = user;
      res.status(401).json("Success");
      next();
    });
  } else {
    res.status(401).json("Not allowed");
  }
};
//Test route to test verification
app.get("/main", verify, (req, res) => {});

//Setting up a listener
app.listen(PORT, () => console.log(`backend server is running on ${PORT}`));

export default app;
