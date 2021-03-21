import React from "react";
import { Container, Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

export default function WhatIsMetadataSection() {
  return (
    <Container
      style={{
        backgroundColor: "#FFE5F3",
        maxWidth: "100%",
      }}
    >
      <Grid container justify="center" direction="column" alignItems="center">
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
            What is NFT metadata? 🎨️
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
            And why you should care about how its stored
          </div>
        </Grid>
        <Grid
          item
          style={{
            marginTop: "20px",
            width: "100%",
            marginBottom: "20px",
          }}
          xs={10}
        >
          <Paper
            elevation={0}
            style={{
              border: "1px solid #C4C4C4",
              padding: "20px",
              borderRadius: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: "24px",
                marginBottom: "10px",
              }}
            >
              NFT metadata is the artwork you may or may not be buying
            </div>

            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              NFT metadata refers to the assets that comprise the NFT. This
              could be assets like digital artworks, paintings, audio files,
              video files, photographs, gifs, records of unique traits, etc. In
              essence, the metadata is what you might assume you are buying, an
              immutable artwork stored on Ethereum for example. Unfortunately,
              this is not often the case. The ways in which the metadata is
              linked to the underlying NFT can vary widely between platforms,
              artists and developers. It can be as simple as a URL referenced in
              the token contract through to immutable onchain storage on
              Ethereum (see{" "}
              <a href="https://avastars.io/" target="_blank">
                Avastars
              </a>{" "}
              as an example of an NFT with Ethereum onchain storage).
              <br />
              <br />
              When the metadata is stored solely on a centralized provider or in
              an insecure way, such as a URL or on Google Drive, there is a
              massive risk that the underlying asset will eventually be deleted.
              In fact, it’s practically inevitable that it will be deleted given
              that the average website lifespan is just{" "}
              <a
                href="https://www.orbitmedia.com/blog/website-lifespan-and-you/#:~:text=The%20average%20website%20lifespan%20is%202%20years%207%20months"
                target="_blank"
              >
                31 months
              </a>
              . In such a case, it’s not a question of if it will be deleted but
              when. If your metadata is deleted and there is no backup, all you
              would be left with is the underlying ERC-721 token and a broken
              link. In the words of{" "}
              <a
                href="https://twitter.com/drewpotential/status/1372222290159575046"
                target="_blank"
              >
                @drewpotential
              </a>{" "}
              <b>
                “It’s like “buying” the Mona Lisa and getting lat/long
                coordinates for its position on the wall in the louvre”.
              </b>
              <br />
              <br />
              This is not a new risk. It has already impacted owners of tokens
              like TronDogs and NiftyMoji where the assets were permanently lost
              when the projects shut down. Assets can also be lost temporarily
              if, for example, there is a sole IPFS node storing the content
              associated with an IPFS hash and it goes offline. Lost NFT
              metadata on a wide scale could not only impact the collectors and
              artists, but could negatively impact the NFT ecosystem as a whole.
              <br />
              <br />
              The good news is that if you are proactive about finding out how
              your assets are saved, you can make any necessary changes and
              backups to ensure their longevity. The most secure ways of saving
              your metadata include (A) onchain storage on Ethereum (but this is{" "}
              <a
                href="https://ethereum.stackexchange.com/questions/872/what-is-the-cost-to-store-1kb-10kb-100kb-worth-of-data-into-the-ethereum-block#:~:text=It%20costs%20about%200.003%20ETH,USD%20per%20GB%20of%20storage"
                target="_blank"
              >
                <i><b>extremely</b></i> expensive
              </a>{" "}
              like ~$76,000 USD per GB of storage expensive) or (B) saving your
              metadata on Arweave which is a protocol built specifically for
              permanent data storage (this is our preferred method for metadata
              storage and it is extremely cost effective, for example you’d pay
              a one time ~$14 USD per GB as of March 21, 2021 - see their fee
              calculator for permanent data storage{" "}
              <a
                href="https://55mcex7dtd5xf4c627v6hadwoq6lgw6jr4oeacqd5k2mazhunejq.arweave.net/71giX-OY-3LwXtfr44B2dDyzW8mPHEAKA-q0wGT0aRM)"
                target="_blank"
              >
                here
              </a>{" "}
              for the most up to date costs
              <br />
              <br />
              We made this nifty tool to make it easy for you to see how your
              assets are stored. Try it out! Send us your feedback! Contribute
              to the project (it’s open source).
              <br />
              <br />
              Most of all, we hope this helps you protect your NFTs long into
              the future!
            </div>
          </Paper>
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item xs={4}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
