import "./App.css";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
// import Message from "./components/Message/Message";
function App() {
  return (
    <>
    {/* <Message/> */}
      <Switch>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </>
  );
}

export default App;
