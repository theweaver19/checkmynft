import React from "react"
import {Container, Paper} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"

export default function HowItWorksSection() {

  return (
      <Container
          style={{
            backgroundColor: "#E8D7FF",
            maxWidth: "100%",
          }}
      >
        <Grid
            container
            justify="center"
            direction="column"
            alignItems="center"
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
              How it works 💾
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
              A brief explanation of how we assign ratings to assets
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
                Storage Provider & NFT Asset Linking
              </div>

              <div
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontSize: "14px",
                  }}
              >
                CheckMyNFT rates your NFT asset storage based on the
                reliability of the provider used and whether the asset is
                linked directly to the ERC-721 token. <br />
                <br />
                Centralized providers such as AWS S3, Dropbox and Google
                Drive are considered the least desirable as there is a risk
                that the assets could be lost if the NFT issuer or storage
                provider ceases operations or payment. Decentralized
                providers are most desirable with{" "}
                <a href="https://ipfs.io/" target="_blank" rel="noreferrer">
                  IPFS
                </a>{" "}
                being of medium strength and{" "}
                <a
                    href="https://www.arweave.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                  Arweave
                </a>{" "}
                being of the highest stength. Assets stored using IPFS rely
                on the goodwill of the people storing it. IPFS acts more as
                a map telling you where a specific piece of data resides,
                but does not incentivize anyone for actually storing such
                data. Arweave is most desirable in the ranking as it ensures
                permanent storage of the asset by incentivizing the storers
                through an upfront endowment payment. <br /> <br /> We also
                consider whether the asset is linked directly to it’s
                corresponding ERC-721 token.
                <br /> For example, in the case of{" "}
                <a
                    href="https://etherscan.io/token/0xc2c747e0f7004f9e8817db2ca4997657a7746928#readContract"
                    target="_blank"
                    rel="noreferrer"
                >
                  Hashmasks
                </a>
                , the files are stored on IPFS but are not directly linked
                to the ERC-721 other than through their Provenance website.
                This results in a poor rating as there is the asset is not
                tied directly to the token. In contrast, in the case of{" "}
                <a
                    href="https://etherscan.io/token/0xc6b0b290176aaab958441dcb0c64ad057cbc39a0?a=87#readContract"
                    target="_blank"
                    rel="noreferrer"
                >
                  PixaWizards
                </a>
                , the IPFS URI is linked directly to each token which gives
                it a Medium strength rating.
              </div>
            </Paper>

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
                Improve your NFT Asset score (for free)
              </div>

              <div
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontSize: "14px",
                  }}
              >
                If your NFT asset has a medium ranking and is saved on IPFS,
                CheckMyNFT allows you to upload your file that resides on
                IPFS to Arweave where it will be permanently available!
                <br />
                <br />
                We use{" "}
                <a
                    href="https://ipfs2arweave.com"
                    alt="ipfs2arweave"
                    target="_blank"
                    rel="noreferrer"
                >
                  IPFS2Arweave.com
                </a>{" "}
                to permanently deploy the asset from IPFS to Arweave. To do
                this, ipfs2arweave take the asset’s IPFS Hash, stores the
                data onto Arweave and pins it to IPFS.
                <br /> <br />
                Plus, this will boost your NFT Asset score to strong 💪
              </div>
            </Paper>

            <Paper
                elevation={0}
                style={{
                  border: "1px solid #C4C4C4",
                  padding: "20px",
                  borderRadius: "20px",
                }}
            >
              <div
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: "24px",
                    marginBottom: "20px",
                  }}
              >
                How to fix an incorrect rating
              </div>

              <div
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontSize: "14px",
                  }}
              >
                In the event that an NFT’s asset storage practices have been
                incorrectly interpreted and rated, the NFT issuer can
                contact us at{" "}
                <a href="mailto:checkmynft@gmail.com">
                  checkmynft@gmail.com
                </a>{" "}
                to clarify and provide additional details.
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
