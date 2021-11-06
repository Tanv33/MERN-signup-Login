import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function PostCard({
  title,
  subHeader,
  smallImg,
  mainImg,
  content,
}) {
  return (
    <div>
      <Card sx={{ flexGrow: 1, maxWidth: 900, m: 2 }}>
        <CardHeader
          avatar={<Avatar alt="" src={smallImg} />}
          title={title ? title : "User"}
          subheader={subHeader ? subHeader : "Waiting..."}
        />
        {
          <CardMedia
            component="img"
            image={
              mainImg ? mainImg : "https://www.w3schools.com/css/img_lights.jpg"
            }
            alt="Post Pics"
          />
        }

        <CardContent>
          {
            <Typography variant="body2" color="text.secondary" component="p">
              {content ? content : "Waiting for content..."}
            </Typography>
          }
        </CardContent>
        <Button sx={{ m: 1 }} variant="contained" color="error">
          Delete
        </Button>
      </Card>
    </div>
  );
}
