const express = require("express");
// const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 2000;

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
  gennder: String,
  phoneNumber: Number,
  password: String,
  address: String,
});

// let arr = []

// app.get("/", (req, res) => res.send("<h1>You are on /</h1>"));

app.get("/api/v1/signupuser", (req, res) => {
  // res.send(arr);
  signup.find({}, (err, data) => {
    res.send(data);
  });
  // res.send("get")
});
app.post("/api/v1/signupuser", (req, res) => {
  const signupuser = new signup({
    fullName: req.body.fullName,
    email: req.body.email,
    gennder: req.body.gender,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    address: req.body.address,
  });
  signupuser.save().then(() => {
    console.log("User created");
    res.send("user created");
  });

  // arr.push({
  //     fullName: req.body.fullName,
  //     email: req.body.email,
  //     gender: req.body.gender,
  //     phoneNumber:req.body.phoneNumber,
  //     password: req.body.password,
  //     address:req.body.address,
  // });
  // res.send("post created")
});

app.post("/api/v1/login", (req, res) => {
  signup.findOne(
    {
      email: req.body.email,
      password: req.body.password,
    },
    (err, data) => {
      if (data) {
        res.send("matched");
      } else {
        res.send("error");
      }
    }
  );
});

// app.put("/api/v1/signupuser", (req, res) =>(
//     res.send("<h1>Put</h1>")
// ));
// app.delete("/api/v1/signupuser", (req, res) =>(
//     res.send("<h1>Delete</h1>")
// ));

app.listen(PORT, () =>
  console.log(`Example app listening on http://localhost:${PORT}`)
);
