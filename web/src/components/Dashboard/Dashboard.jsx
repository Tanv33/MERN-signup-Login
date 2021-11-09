import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../context/Context";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Container } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";
import Message from "../Message/Message";
import PostCard from "../PostCard/PostCard";
import InfiniteScroll from "react-infinite-scroller";
import Spinner from "../Spinner/Spinner";

function Dashboard() {
  const history = useHistory();
  const dev = "http://localhost:2000";
  const baseURL =
    window.location.hostname.split(":")[0] === "localhost" ? dev : "";
  let { state, dispatch } = useContext(GlobalContext);
  const [inputText, setInputText] = useState("");
  const [allPost, setAllPost] = useState([]);
  const [continuousPost, setContinuousPost] = useState(false);
  const [messageBar, setMessageBar] = useState("");
  const [isMore, setIsMore] = useState(true);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/posts?page=0`, {
        withCredentials: true,
      })
      .then((result) => {
        // let arr = [];
        // result.data.forEach((element) => {
        //   arr.unshift(element);
        // });
        // setAllPost([...arr]);
        setAllPost(result.data);
        // console.log(result.data);
      });
    return () => {
      // cleanup
    };
    // eslint-disable-next-line
  }, [continuousPost]);
  const inputOnChange = (e) => {
    setInputText(e.target.value);
  };

  const submitPost = (a) => {
    a.preventDefault();
    if (inputText !== "") {
      if (state?.user?.fullName) {
        axios
          .post(
            `${baseURL}/api/v1/posts`,
            {
              text: inputText,
            },
            {
              withCredentials: true,
            }
          )
          .then((result) => {
            // console.log(result.data);
            setContinuousPost(!continuousPost);
            setInputText("");
          });
      }
    }
  };
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
  // const loadMore = () => {
  //   axios
  //     .get(`${baseURL}/api/v1/posts?page=${allPost.length}`, {
  //       withCredentials: true,
  //     })
  //     .then((result) => {
  //       if (result.data.length) {
  //         const newPost = [...allPost, ...result.data];
  //         setAllPost(newPost);
  //       } else {
  //         setIsMore(false);
  //       }
  //     });
  //   return () => {
  //     // cleanup
  //   };
  // };
  const loadMore = () => {
    axios
      .get(`${baseURL}/api/v1/posts?page=${allPost.length}`, {
        withCredentials: true,
      })
      .then((result) => {
        if (result.data.length) {
          const newPost = [...allPost, ...result.data];
          setAllPost(newPost);
        } else {
          setIsMore(false);
        }
      });
    return () => {
      // cleanup
    };
  };
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "#800020" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => history.push("/")}
              >
                Home
              </span>
            </Typography>
            <Button color="inherit" onClick={() => history.push("/profile")}>
              Profile
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Container>
        <Typography
          variant="h4"
          style={{ marginTop: "30px", fontWeight: "bold", color: "darkred" }}
        >
          Type your Post
        </Typography>
        <form onSubmit={submitPost}>
          <Box
            sx={{
              "& > :not(style)": {
                marginTop: "20px",
                marginBottom: "14px",
                width: "100%",
              },
            }}
            autoComplete="off"
          >
            <TextField
              label="Enter text"
              value={inputText}
              onChange={inputOnChange}
              variant="filled"
            />
          </Box>
          <Button
            variant="contained"
            color="error"
            size="large"
            style={{ marginBottom: "40px" }}
            type="submit"
          >
            Post
          </Button>
        </form>
        <div
          style={{
            backgroundColor: "#800020",
            textAlign: "center",
            padding: "16px",
            borderRadius: "5px",
          }}
        >
          <Typography variant="h6" color="white">
            All Users Posts
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <br />
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={isMore}
            loader={
              <Spinner key={0} />
              // <div className="loader" >
              //   Loading ...
              // </div>
            }
          >
            {allPost.map((element) => (
              <PostCard
                // identity={element._id}
                key={element._id}
                title={element.author}
                subHeader="10 mins ago"
                content={element.text}
              />
            ))}
          </InfiniteScroll>
        </div>
        {/* <section
          style={{ margin: "14px", display: "flex", justifyContent: "center" }}
        >
          {isMore ? (
            <Button variant="contain
            ed" onClick={loadMore} color="secondary">
              Load more
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled
              onClick={loadMore}
              color="secondary"
            >
              Sorry No More Post
            </Button>
          )}
        </section> */}
      </Container>

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
    </div>
  );
}

export default Dashboard;
