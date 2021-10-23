const express = require("express");
// const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 2000;
const bcrypt = require("bcrypt");

// app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://tanveer:tanveer@cluster0.5ksc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

app.use("/", express.static(path.join(__dirname, "/web/build")));

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
    console.log("User created");
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
  });
  newpost.save().then(() => {
    console.log("Post created");
    res.send("Post created");
  });
});

app.get("/api/v1/post", (req, res) => {
  post.find({}, (err, data) => {
    res.send(data);
  });
});

app.use("/**", (req, res) => {
  // res.redirect("/")
  res.sendFile(path.join(__dirname,"/web/build/index.html"));
});
app.listen(PORT, () =>
  console.log(`Example app listening on http://localhost:${PORT}`)
);
