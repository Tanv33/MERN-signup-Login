import "./App.css";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import { Switch, Route } from "react-router-dom";
// Redirect
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import axios from "axios";
import React, { useEffect } from "react";

import { GlobalContext } from "./context/Context";
import { useContext } from "react";
import Splash from "./components/Splash/Splash";

function App() {
  let { state, dispatch } = useContext(GlobalContext);
  const dev = "http://localhost:2000";
  const baseURL =
    window.location.hostname.split(":")[0] === "localhost" ? dev : "";

  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/tokenforcontext`, {
        withCredentials: true,
      })
      .then((result) => {
        if (result?.data?.email) {
          dispatch({
            type: "USER_LOGIN",
            payload: {
              id: result.data.id,
              fullName: result.data.fullName,
              email: result.data.email,
              gender: result.data.gender,
              phoneNumber: result.data.phoneNumber,
              address: result.data.address,
            },
          });
        } else {
          dispatch({ type: "USER_LOGOUT" });
        }
      })
      .catch((e) => {
        dispatch({ type: "USER_LOGOUT" });
        // console.log(e);
      });
    return () => {
      // cleanup
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {/* {state?.user?.email ? (
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/profile" component={Profile} />
          <Redirect to="/" />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Redirect to="/" />
        </Switch>
      )} */}

      {/* {console.log(state.user)} */}

      {state.user === undefined ? (
        <Switch>
          <Route exact path="/">
            {/* <h1>Loading...</h1> */}
            <Splash/>
          </Route>
          <Route path="*">
            {/* <h1>Loading...</h1> */}
            <Splash/>

          </Route>
          {/* <Redirect to="/" /> */}
        </Switch>
      ) : null}
      {state.user === null ? (
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route path="*">
            <Login />
          </Route>
          {/* <Redirect to="/" /> */}
        </Switch>
      ) : null}
      {state.user ? (
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/profile" component={Profile} />
          <Route path="*">
            <Dashboard />
          </Route>
          {/* <Redirect to="/" /> */}
        </Switch>
      ) : null}
    </>
  );
}

export default App;
