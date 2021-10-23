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
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import Message from "../Message/Message";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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

  useEffect(() => {
    axios.get(`${baseURL}/api/v1/post`).then((result) => {
      let arr = [];
      result.data.forEach((element) => {
        arr.unshift(element);
      });
      setAllPost([...arr]);
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
          .post(`${baseURL}/api/v1/post`, {
            text: inputText,
            author: state.user.fullName,
          })
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
      setMessageBar(true);
      setTimeout(() => {
        history.push("/login");
        dispatch({
          type: "USER_LOGOUT",
          payload: null,
        });
        setMessageBar([]);
      }, 1000);
    } else {
      setMessageBar(false);
      setTimeout(() => {
        setMessageBar([]);
      }, 1000);
    }
  };

  const [stated, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...stated, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {[
          `Name: ${state.user.fullName}`,
          `Email: ${state.user.email}`,
          `Gender: ${state.user.gender}`,
          `Phone Number: ${state.user.phoneNumber}`,
          `Address: ${state.user.address}`,
        ].map((text, index) => (
          <ListItem key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
  //table

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#800020",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "	#800020" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 0, position: "relative" }}
            >
              <MenuIcon />
              <div style={{ position: "absolute", left: "0px" }}>
                {["left"].map((anchor) => (
                  <React.Fragment key={anchor}>
                    <Button
                      onClick={toggleDrawer(anchor, true)}
                      style={{ color: "transparent", padding: "0px" }}
                    >
                      {anchor}
                    </Button>
                    <SwipeableDrawer
                      anchor={anchor}
                      open={stated[anchor]}
                      onClose={toggleDrawer(anchor, false)}
                      onOpen={toggleDrawer(anchor, true)}
                    >
                      {list(anchor)}
                    </SwipeableDrawer>
                  </React.Fragment>
                ))}
              </div>
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
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

        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ textAlign: "center " }}>
                  <Typography variant="h6">All Users Posts</Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state?.user?.fullName &&
                allPost.map((element) => (
                  <StyledTableRow key={element._id}>
                    <StyledTableCell component="th" scope="row">
                      {element.text} -{" "}
                      <span style={{ fontWeight: "bold", color: "red" }}>
                        {element.author}
                      </span>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
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
