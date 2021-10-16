import "./Login.css";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Message from "../Message/Message.jsx";
import { useHistory } from "react-router-dom";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .min(14, "Email should be 14 characters long")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

function Login() {
  const [messageBar, setMessageBar] = useState("");
  const dev = "http://localhost:2000";
  const baseURL =
    window.location.hostname.split(":")[0] === "localhost" ? dev : "";
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .post(`${baseURL}/api/v1/login`, {
          email: values.email,
          password: values.password,
        })
        .then((result) => {
          if (result.data === "matched") {
            //message
            // console.log("match");
            setTimeout(() => {
               history.push("/dashboard")
              setMessageBar([]);
            }, 1000);
            setMessageBar(true);
          } else {
            // console.log("Email or password is invalid");
            setMessageBar(false);
            setTimeout(() => {
              setMessageBar([]);
            }, 1000);
          }
        });
    },
  });

  const history = useHistory();
  return (
    <div>
      {messageBar === true ? <Message type="success" message="Welcome" /> : ""}
      {messageBar === false ? (
        <Message type="error" message="Invalid email or password" />
      ) : (
        ""
      )}

      <main>
        <section className="glass">
          <div className="flex">
            <h1 className="loginHeading">Login Form</h1>
          </div>
          <Box
            type="form"
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "70%" },
            }}
            noValidate
            autoComplete="off"
            textAlign="center"
            onSubmit={formik.handleSubmit}
          >
            <TextField
              fullWidth
              type="email"
              name="email"
              label="Email"
              variant="outlined"
              placeholder="Enter your Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              fullWidth
              type="password"
              name="password"
              id="outlined-basic"
              label="Password"
              variant="outlined"
              placeholder="Enter Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                size="medium"
                variant="contained"
                color="info"
                style={{ margin: "4px" }}
              >
                Submit
              </Button>
              <Button
                size="medium"
                variant="contained"
                color="success"
                style={{ margin: "4px" }}
                onClick={() => history.push("/signup")}
              >
                Create an account
              </Button>
            </div>
          </Box>
        </section>
      </main>
    </div>
  );
}

export default Login;
