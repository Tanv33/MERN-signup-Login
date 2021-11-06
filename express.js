import express from "express";
import cors from "cors";
import path from "path";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 2000;
const SECRET = process.env.SECRET || "0900";
const __dirname = path.resolve();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
mongoose.connect(
  "mongodb+srv://tanveer:tanveer@cluster0.5ksc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

app.use("/", express.static(path.join(__dirname, "/web/build")));
// app.get("/", (req, res, next) => {
//   res.sendFile(path.join(__dirname, "./web/build/index.html"))
// })
const signup = mongoose.model("signup User", {
  fullName: String,
  email: String,
  gender: String,
  phoneNumber: Number,
  password: String,
  address: String,
});

const post = mongoose.model("Users Post", {
  text: String,
  author: String,
  authorId: String,
});

app.get("/api/v1/signupuser", (req, res) => {
  signup.find({}, (err, data) => {
    res.send(data);
  });
});

app.post("/api/v1/signupuser", async (req, res) => {
  // Bcrypt
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);
  const signupuser = await new signup({
    fullName: req.body.fullName,
    email: req.body.email,
    gender: req.body.gender,
    phoneNumber: req.body.phoneNumber,
    password: secPass,
    address: req.body.address,
  });
  signupuser.save().then(() => {
    // console.log("User created");
    res.send("user created");
  });
});

app.post("/api/v1/login", async (req, res) => {
  try {
    const user = await signup.findOne({ email: req.body.email });
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      // result === true
      if (!err) {
        if (result) {
          var token = jwt.sign(
            {
              id: user._id,
              fullName: user.fullName,
              email: user.email,
              gender: user.gender,
              phoneNumber: user.phoneNumber,
              address: user.address,
            },
            SECRET
          );
          // console.log("token", token);
          res.cookie("token", token, {
            httpOnly: true,
            //expires: (new Date().getTime + 300000), // 5 minutes
            maxAge: 86400000,
          });
          res.send(user);
        } else {
          res.send("error");
        }
      }
    });
  } catch (error) {
    res.send("error");
    // console.log(error);
  }
});

app.post("/api/v1/post", async (req, res) => {
  const newpost = await new post({
    text: req.body.text,
    author: req.body.author,
    authorId: req.body.authorId,
  });
  newpost.save().then(() => {
    // console.log("Post created");
    res.send("Post created");
  });
});

app.get("/api/v1/post", (req, res) => {
  post.find({}, (err, data) => {
    res.send(data);
  });
});

app.use((req, res, next) => {
  jwt.verify(req.cookies.token, SECRET, function (err, decoded) {
    req.body._decoded = decoded;
    // console.log("decoded", decoded);
    // console.log("error", err);
    next();
  });
});

app.post("/api/v1/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
  });
  res.send("token vanished");
});

app.get("/api/v1/tokenforcontext", (req, res) => {
  signup.findOne({ email: req.body._decoded?.email }, (err, user) => {
    if (user) {
      res.send({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
    } else {
      res.send("error:" + err);
    }
  });
});

app.use("/**", (req, res) => {
  // res.redirect("/")
  res.sendFile(path.join(__dirname, "/web/build/index.html"));
});
app.listen(PORT, () =>
  console.log(`Example app listening on http://localhost:${PORT}`)
);
