  import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useHistory } from "react-router-dom";

export default function Home() {
  const history = useHistory();
  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{backgroundColor:"#800020"}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <span
              onClick={() => history.push("/")}
              style={{ cursor: "pointer" }}
            >
              Dashboard
            </span>
          </Typography>
          <Button color="inherit" onClick={() => history.push("/login")}>
            Login
          </Button>
          <Button color="inherit" onClick={() => history.push("/signup")}>
            Signup
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
    <Container>

    <div style={{ width:"100%",height:"80vh", display:"flex",justifyContent:"center", alignItems:"center",textAlign:"center"}}>
    <Typography variant="h4" style={{fontWeight:"bolder",color:"#800020"}} >Login To Access Services</Typography>

    </div>
    </Container>
    </>
  );
}
