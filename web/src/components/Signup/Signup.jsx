import "./Signup.css";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Message from "../Message/Message";
import { useHistory } from "react-router-dom";

const validationSchema = yup.object({
  fullName: yup
    .string("Enter a valid Name")
    .min(8, "Name should be 8 characters long")
    .required("Name is required"),

  email: yup
    .string("Enter your email")
    .min(14, "Email should be 14 characters long")
    .email("Enter a valid email")
    .required("Email is required"),
  phoneNumber: yup
    .string("Enter your phone number")
    .min(10, "Phone number should be 10 integers long")
    .required("Phone number is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),

  address: yup
    .string("Enter your address")
    .min(20, "Address should be of minimum 20 characters in length")
    .required("Address is required"),
});
function Signup() {
  const history = useHistory();
  const [messageBar, setMessageBar] = useState("");
  const dev = "http://localhost:2000";
  const baseURL =
    window.location.hostname.split(":")[0] === "localhost" ? dev : "";
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      address: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const genderValue = document.querySelector(
        'input[name="gender"]:checked'
      ).value;
      axios
        .post(`${baseURL}/api/v1/signupuser`, {
          fullName: values.fullName,
          email: values.email,
          gender: genderValue,
          phoneNumber: Number(values.phoneNumber),
          password: values.password,
          address: values.address,
        })
        .then((result) => {
          // console.log(result.data);
          if (result.data === "user created") {
            //message
            setMessageBar(true);
            setTimeout(() => {
              history.push("/login")
              setMessageBar("");
            }, 1000);
          }
        })
        .catch((err) => {
          // console.log(err);
        });
    },
  });

  useEffect(() => {
    axios.get(`${baseURL}/api/v1/signupuser`).then((res) => {
      // console.log(res);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {messageBar === true ? (
        <Message
          type="success"
          message="Welcome! Successfully account created"
        />
      ) : (
        ""
      )}
      <main>
        <section className="glass">
          <div className="flex">
            <h1 className="signHeading">Signup Form</h1>
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
              name="fullName"
              label="Full Name"
              variant="outlined"
              placeholder="Enter Your Name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
            />
            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email"
              variant="outlined"
              placeholder="Enter your Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <FormControl component="fieldset">
              <FormLabel component="legend" style={{ textAlign: "left" }}>
                Gender
              </FormLabel>
              <RadioGroup
                aria-label="gender"
                defaultValue="male"
                name="genderParent"
              >
                <FormControlLabel
                  name="gender"
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  name="gender"
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              name="phoneNumber"
              label="Phone Number"
              variant="outlined"
              placeholder="Enter Phone Number"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
            />
            <TextField
              fullWidth
              name="password"
              type="password"
              label="Password"
              variant="outlined"
              placeholder="Enter Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              fullWidth
              name="address"
              id="outlined-basic"
              label="Address"
              variant="outlined"
              placeholder="Type Your address"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
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
                onClick={() => history.push("/login")}
              >
                I have an account
              </Button>
            </div>
          </Box>
        </section>
      </main>
    </div>
  );
}

export default Signup;
