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
        direction="column"
        alignItems="center"
        alignContent="center"
      >
        <Grid item>
          <div
            style={{
              marginTop:"30px",
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "24px",
              marginBottom: "10px",
              color:"#9856EC"
            }}
          >
            Help improve CheckMyNFT.com 💡
          </div>
        </Grid>
        <Grid item>
          <div
            style={{
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: "18px",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            CheckMyNFT is an open-source project. We welcome your contributions
            to improve upon this project!
          </div>
        </Grid>
      </Grid>
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
