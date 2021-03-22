import React from "react";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import arn from "../images/arn.png";
import bitcoincom from "../images/bitcoincom.png";
import decrypt from "../images/decrypt.png";
import defipulse from "../images/defipulse.png";
import futurism from "../images/futurism.png";

export default function FeaturedInSection() {
  return (
    <Container
      style={{
        backgroundColor: "#D5FFC6",
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
              textAlign: "center",
            }}
          >
            As featured in 📣{" "}
          </div>
        </Grid>

        <Grid item style={{ marginTop: "20px", marginBottom: "60px" }} xs={10}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <a
                href="https://decrypt.co/62037/missing-or-stolen-nfts-how-to-protect"
                target="_blank"
                rel="noreferrer"
              >
                <img src={decrypt} alt="Decrypt" />
              </a>
            </Grid>
            <Grid item>
              <a
                href="https://news.bitcoin.com/nft-immutability-debate-grows-as-tokenized-tweets-get-deleted-and-nft-images-are-replaced/"
                target="_blank"
                rel="noreferrer"
              >
                <img src={bitcoincom} alt="Bitcoin.com" />
              </a>
            </Grid>
            <Grid item>
              <a
                href="https://yieldfarmer.substack.com/p/defi-pulse-farmer-32"
                target="_blank"
                rel="noreferrer"
                
              >
                <img src={defipulse} alt="Defi Pulse" />
              </a>
            </Grid>
            <Grid item xs>
              <a
                href="https://arweave.news/nfts-arweave-is-here-for-you/"
                target="_blank"
                rel="noreferrer"
              >
                <img src={arn} alt="Arweave News Network" />
              </a>
            </Grid>
            <Grid item>
              <a
                href="https://futurism.com/nfts-have-huge-persistence-problem"
                target="_blank"
                rel="noreferrer"
              >
                <img src={futurism} alt="Futurism" />
              </a>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
