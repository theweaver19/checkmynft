import React from "react";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { TwitterTweetEmbed } from "react-twitter-embed";

export default function TwitterSection() {
  return (
    <Container
      style={{
        backgroundColor: "rgba(255, 254, 160, 1)",
        maxWidth: "100%",
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
              color: "rgba(243, 125, 245, 1)",
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "24px",
              marginTop: "40px",
            }}
          >
            Food for thought 🍱
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
            Some thoughts around NFT asset storage from crypto twitter
          </div>
        </Grid>
        <Grid item>
          <Grid
            container
            spacing={1}
            style={{ width: "100%" }}
            justify="center"
          >
            <Grid item md>
              <TwitterTweetEmbed
                tweetId={"1308315853335732224"}
                options={{
                  conversation: "none",
                  cards: "hidden",
                  width: 400,
                }}
              />
            </Grid>
            <Grid item md>
              <TwitterTweetEmbed
                tweetId={"1363541347689463808"}
                options={{
                  conversation: "none",
                  cards: "hidden",
                  width: 400,
                }}
              />
            </Grid>
            <Grid item md>
              <TwitterTweetEmbed
                tweetId={"1353370945730306048"}
                options={{
                  conversation: "none",
                  cards: "hidden",
                  width: 400,
                }}
              />
            </Grid>
            <Grid item md>
              <TwitterTweetEmbed
                tweetId={"1362914198548750336"}
                options={{
                  conversation: "none",
                  cards: "hidden",
                  width: 400,
                }}
              />
            </Grid>
            <Grid item md>
              <TwitterTweetEmbed
                tweetId={"1362539804236386305"}
                options={{
                  conversation: "none",
                  cards: "hidden",
                  width: 400,
                }}
              />
            </Grid>
            <Grid item md>
              <TwitterTweetEmbed
                tweetId={"1341827289907146753"}
                options={{
                  conversation: "none",
                  cards: "hidden",
                  width: 400,
                }}
              />
            </Grid>
            <Grid item md>
              <TwitterTweetEmbed
                tweetId={"1354320520141889540"}
                options={{
                  conversation: "none",
                  cards: "hidden",
                  width: 400,
                }}
              />
            </Grid>
            <Grid item md>
              <TwitterTweetEmbed
                tweetId={"1319977641252933633"}
                options={{
                  conversation: "none",
                  cards: "hidden",
                  width: 400,
                }}
              />
            </Grid>
            <Grid item md>
              <TwitterTweetEmbed
                tweetId={"1358080255978782721"}
                options={{
                  conversation: "none",
                  cards: "hidden",
                  width: 400,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
