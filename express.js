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
  created: { type: Date, default: Date.now },

  author: String,
  authorId: String,
});

app.get("/api/v1/signupuser", (req, res) => {
  signup.find({}, (err, data) => {
    res.send(data);
  });
});

app.post("/api/v1/signupuser", async (req, res) => {
  const { fullName, email, gender, phoneNumber, password, address } = req.body;
  if (!fullName || !email || !gender || !phoneNumber || !password || !address) {
    console.log("signup field missing");
    res.status(403).send("signup field missing");
    return;
  } else {
    signup.findOne({ email: email }, async (err, user) => {
      if (user) {
        res.send("user already exist");
      } else {
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
      }

      if (err) {
        res.status(415).send("error in signup: " + err);
      }
    });
  }
});

app.post("/api/v1/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(403).send("email or password is missing");
    return;
  }
  signup.findOne({ email: email }, async (err, user) => {
    if (!user) {
      res.send("Incorrect email");
    }
    if (err) {
      res.status(500).send("Server error");
    } else {
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          // result === true
          // console.log(result);
          if (err) {
            res.status(500).send("Server error");
            // console.log(err);
          } else {
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
              res.cookie("token", token, {
                httpOnly: true,
                //expires: (new Date().getTime + 300000), // 5 minutes
                maxAge: 86400000,
              });
              res.send(user);
              // console.log(user);
            } else {
              res.send("Incorrect password");
            }
          }
        });
      } else {
      }
    }
  });
  // const user = await signup.findOne({ email: req.body.email });
  // bcrypt.compare(req.body.password, user.password, function (err, result) {
  //   // result === true
  //   if (!err) {
  //     if (result) {
  //       var token = jwt.sign(
  //         {
  //           id: user._id,
  //           fullName: user.fullName,
  //           email: user.email,
  //           gender: user.gender,
  //           phoneNumber: user.phoneNumber,
  //           address: user.address,
  //         },
  //         SECRET
  //       );
  //       res.cookie("token", token, {
  //         httpOnly: true,
  //         //expires: (new Date().getTime + 300000), // 5 minutes
  //         maxAge: 86400000,
  //       });
  //       res.send(user);
  //     } else {
  //       res.send("error");
  //     }
  //   }
  // });
});

app.use((req, res, next) => {
  jwt.verify(req.cookies.token, SECRET, function (err, decoded) {
    req.body._decoded = decoded;
    // console.log("decoded", req.body._decoded);
    // console.log("error", err);
    if (!err) {
      next();
    } else {
      // console.log(err);
      res.status(401).sendFile(path.join(__dirname, "./web/build/index.html"));
    }
  });
});

app.post("/api/v1/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
  });
  res.send("token vanished");
});

app.get("/api/v1/tokenverify", (req, res) => {
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

app.post("/api/v1/posts", async (req, res) => {
  const newpost = await new post({
    text: req.body.text,
    author: req.body._decoded.fullName,
    authorId: req.body._decoded.id,
  });
  newpost.save().then(() => {
    // console.log("Post created");
    res.send("Post created");
  });
});

app.get("/api/v1/posts", (req, res) => {
  const page = Number(req.query.page);
  // console.log("page: ", page);
  post
    .find({})
    .sort({ created: "desc" })
    .skip(page)
    .limit(2)
    .exec((err, data) => {
      res.send(data);
    });
});

app.post("/api/v1/postdelete", async (req, res) => {
  // console.log(req.body);
  // console.log(req.body._decoded);
  const deleting = await post.deleteOne({
    _id: req.body.postId,
    authorId: req.body._decoded.id,
  });
  if (deleting.deletedCount) {
    // console.log(deleting.deletedCount);
    // console.log("deleted");
    res.send("Successfully Deleted");
  } else {
    //  console.log("It's not your post");
    res.send("It's not your Post");
  }
});

app.get("/api/v1/post", (req, res) => {
  post
    .find({ authorId: req.body._decoded?.id })
    .sort({ created: "desc" })
    .exec((err, data) => {
      res.send(data);
    });
});
app.put("/api/v1/updateprofile",  (req, res) => {
  // res.send(req.body)
  signup.findByIdAndUpdate(
    req.body._decoded.id,
    {
      fullName: req.body.fullName,
      gender: req.body.gender,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    },
   function  (err, result) {
     if (result) {
      //  console.log(result);
      res.send(result)
     }
      if (err) {
        // console.log(err);
      }
    }
  );
});

app.use("/**", (req, res) => {
  // res.redirect("/")
  res.sendFile(path.join(__dirname, "/web/build/index.html"));
});
app.listen(PORT, () =>
  console.log(`Example app listening on http://localhost:${PORT}`)
);
