import React from "react";
import { Container, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import github from "../images/github.png";
import twitter from "../images/twitter.png";

export default function FooterSection() {
  return (
    <Container
      maxWidth={false}
      style={{
        backgroundColor: "#D8F6FF",
        // width:100%
      }}
    >
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ paddingTop: "20px" }}
      >
        <IconButton
          onClick={() => {
            window.open("https://github.com/theweaver19/checkmynft");
          }}
        >
          <img src={github} alt="github" />
        </IconButton>
        <IconButton
          onClick={() => {
            window.open("https://twitter.com/checkmynft");
          }}
        >
          <img src={twitter} alt="twitter" />
        </IconButton>
      </Grid>
    </Container>
  );
}
