import React from "react"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"

export default function NFTResourcesSection() {

  return (
      <Container
          style={{
            backgroundColor: "#FFE6F3",
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
                  color: "rgba(0, 201, 201, 1)",
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: "24px",
                  marginTop: "40px",
                }}
            >
              NFT Resources 📚
            </div>
          </Grid>
          <Grid item>
            <div
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: "18px",
                  marginTop: "10px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
            >
              Want to learn more about NFTs but aren’t sure where to start?
              Here are some resources for you!
            </div>
          </Grid>
          <Grid item style={{ marginTop: "20px", width: "100%" }} xs={10}>
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
                    marginBottom: "10px",
                  }}
              >
                Learn About NFTs
              </div>
              <ul>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  {" "}
                  <a
                      href="https://linda.mirror.xyz/df649d61efb92c910464a4e74ae213c4cab150b9cbcc4b7fb6090fc77881a95d"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    A beginner’s guide to NFTs
                  </a>{" "}
                  by{" "}
                  <a
                      href="https://twitter.com/ljxie"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    {" "}
                    @ljxie
                  </a>{" "}
                </li>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  {" "}
                  <a
                      href="https://variant.mirror.xyz/T8kdtZRIgy_srXB5B06L8vBqFHYlEBcv6ae2zR6Y_eo"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    NFTs make the internet ownable
                  </a>{" "}
                  by{" "}
                  <a
                      href="https://twitter.com/jessewldn"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    @jessewldn
                  </a>{" "}
                </li>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  {" "}
                  <a
                      href="https://coopahtroopa.mirror.xyz/PF42Z9oE_r6yhZN9jZrrseXfHaZALj9JIfMplshlgQ0"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    NFT Issuance Landscape
                  </a>{" "}
                  by{" "}
                  <a
                      href="https://twitter.com/Cooopahtroopa"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    @Cooopahtroopa
                  </a>{" "}
                </li>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  <a
                      href="https://justincone.com/posts/nft-skeptics-guide/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    The skeptics' introduction to cryptoart and NFTs for
                    digital artists and designers
                  </a>{" "}
                  by Justin Cone
                </li>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  <a
                      href="https://opensea.io/blog/guides/non-fungible-tokens/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    The Non-Fungible Token Bible: Everything you need to
                    know about NFTs
                  </a>{" "}
                  by Devin Finzer
                </li>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  <a
                      href="https://cointelegraph.com/magazine/nonfungible-tokens/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    Nonfungible Tokens: The Quick Guide
                  </a>{" "}
                  by Cointelegraph
                </li>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  <a
                      href="https://arweave.medium.com/nft-permanence-with-arweave-35b5d64eff23"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    NFT Permanence with Arweave
                  </a>{" "}
                  by Arweave Project
                </li>
              </ul>
            </Paper>
          </Grid>
          <Grid
              item
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                width: "100%",
              }}
              xs={10}
          >
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
                    marginBottom: "10px",
                  }}
              >
                Discover NFTs
              </div>
              <ul>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  {" "}
                  <a
                      href="http://nfttok.com"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    NFTTOK Discover NFTs through a TikTok interface
                  </a>{" "}
                  by{" "}
                  <a
                      href="https://twitter.com/mikebodge"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    {" "}
                    @mikebodge
                  </a>{" "}
                </li>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  <a
                      href="https://niftygateway.com/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    Nifty Gateway
                  </a>
                </li>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  <a
                      href="https://nonfungible.com/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    Nonfungible Marketplace Stats
                  </a>
                </li>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  <a
                      href="https://opensea.io/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    OpenSea
                  </a>
                </li>
                <li
                    style={{
                      marginBottom: "10px",
                    }}
                >
                  <a
                      href="https://rarible.com/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 201, 201, 1)",
                      }}
                  >
                    Rarible
                  </a>
                </li>
              </ul>
            </Paper>
          </Grid>
          <Grid
              item
              style={{
                marginBottom: "40px",
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "14px",
                textAlign: "center",
              }}
          >
            Have a resource you want to include here? Email us at{" "}
            <a href="mailto:checkmynft@gmail.com">checkmynft@gmail.com</a>.
          </Grid>
        </Grid>
      </Container>
  );
}
