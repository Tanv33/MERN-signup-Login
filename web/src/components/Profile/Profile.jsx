import React, { useContext, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useHistory } from "react-router-dom";
import Message from "../Message/Message";
import { GlobalContext } from "../../context/Context";
import axios from "axios";
import PostCard from "../PostCard/PostCard";

function Profile() {
  const history = useHistory();
  const dev = "http://localhost:2000";
  const baseURL =
    window.location.hostname.split(":")[0] === "localhost" ? dev : "";
  let { state, dispatch } = useContext(GlobalContext);
  const [messageBar, setMessageBar] = useState("");
  const [allPost, setAllPost] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/post`, {
        withCredentials: true,
      })
      .then((result) => {
        // let arr = [];
        // result.data.forEach((element) => {
        //   arr.unshift(element);
        // });
        // setAllPost([...arr]);
        // console.log(allPost);
        setAllPost(result.data);
      });
    return () => {
      // cleanup
    };
    // eslint-disable-next-line
  }, []);

  const logout = () => {
    if (state?.user?.fullName) {
      axios
        .post(
          `${baseURL}/api/v1/logout`,
          {},
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // console.log("res", res.data);
        });

      setMessageBar(true);
      setTimeout(() => {
        dispatch({
          type: "USER_LOGOUT",
          payload: "",
        });
        history.push("/");
        setMessageBar([]);
      }, 1000);
    } else {
      setMessageBar(false);
      setTimeout(() => {
        setMessageBar([]);
      }, 1000);
    }
  };

  return (
    <div>
      {messageBar === true ? (
        <Message type="success" message="Good bye!" />
      ) : (
        ""
      )}
      {messageBar === false ? (
        <Message type="error" message="Sorry! Something went wrong" />
      ) : (
        ""
      )}

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "#800020" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => history.push("/")}
              >
                {" "}
                Home
              </span>
            </Typography>
            <Button color="inherit" onClick={() => history.push("/profile")}>
              Profile
            </Button>{" "}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            // backgroundColor: "red",
            marginTop: "10px",
            marginBottom: "30px",
          }}
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJdfwoLPgNXoV0q8tDwIPQNUF3drxXLF1KXzJA-kQJKZy0n6x7MdxGnArJ2ghGv95-CYc&usqp=CAU"
            style={{ borderRadius: "50%" }}
            alt="userPic"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // backgroundColor: "red",
            marginBottom: "20px",
          }}
        >
          <div style={{ alignSelf: "center" }}>
            <Typography variant="h6">
              Name: &nbsp;{state.user.fullName}{" "}
            </Typography>
            <Typography variant="h6">
              Email: &nbsp;{state.user.email}
            </Typography>
            <Typography variant="h6">
              Gender: &nbsp;{state.user.gender}
            </Typography>
            <Typography variant="h6">
              Phone Number: &nbsp;{state.user.phoneNumber}
            </Typography>
            <Typography variant="h6">
              Address: &nbsp;{state.user.address}
            </Typography>
          </div>
        </div>
        <br />
        <div
          style={{
            backgroundColor: "#800020",
            textAlign: "center",
            padding: "16px",
            borderRadius: "5px",
          }}
        >
          <Typography variant="h6" color="white">
            Your Posts
          </Typography>
        </div>
        <br />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {allPost.map((element) => (
            <PostCard
              key={element._id}
              title={element.author}
              subHeader="10 mins ago"
              content={element.text}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Profile;
