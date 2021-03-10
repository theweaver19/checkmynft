import React from "react";
import {Container} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"

export default function HeroSection() {
  return (
      <Container>
        <Grid
            container
            spacing={3}
            justify="center"
            direction="column"
            alignItems="center"
            alignContent="center"
        >
          <img
              src={checkMyNFT}
              alt="Check My NFT"
              width="391"
              height="50"
              style={{ marginTop: "50px", objectFit: "contain" }}
          />
          <Grid item>
            <Grid container>
              <Grid item>
                <div
                    style={{
                      color: "#9856EC",
                      fontFamily: "Poppins",
                      fontSize: "20px",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                >
                  Do you know how your NFT’s assets are stored? 🔎 🖼️ ️
                </div>
                <div
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "20px",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                >
                  Don’t let your NFT become a{" "}
                  <span style={{ color: "#FF6161" }}>
                        {"{placeholder}"}
                    <img src={"https://nowhere.hello"} alt="" /> 😢
                      </span>
                </div>

                <div
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      textAlign: "center",
                      marginTop: "10px",
                    }}
                >
                  Enter your NFT contract address & token ID to see the
                  strength of your NFT’s assets.
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={10} style={{ width: "100%" }}>
            <Paper
                elevation={0}
                style={{
                  border: "1px solid #C4C4C4",
                  paddingTop: "20px",
                  paddingBottom: "30px",
                  width: "100%",
                  borderRadius: "20px",
                  marginBottom: "40px",
                }}
            >
              <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    marginRight: "20px",
                    marginLeft: "20px",
                  }}
              >
                <div
                    style={{
                      display: "flex",
                      color: "#8A92B2",
                      fontFamily: "Poppins",
                      alignItems: "center",
                      fontWeight: 600,
                      fontSize: "16px",
                      marginBottom: "20px",
                    }}
                >
                  <img src={eth} alt="ethereum" />
                  Supporting Ethereum NFTs (ERC-721 Compatible) only at this
                  time.
                </div>
                <TextField
                    fullWidth
                    required
                    value={nftAddress}
                    error={errors.nftAddress !== ""}
                    height="100px"
                    helperText={errors.nftAddress}
                    label="NFT contract address"
                    placeholder="ex. 0x06012c8cf97bead5deae237070f9587f8e7a266d"
                    onChange={(e) => {
                      setNFTAddress(e.target.value);
                      validateAddress(e.target.value);
                      setTouched({ ...touched, nftAddress: true });
                    }}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    required
                    value={tokenID}
                    placeholder="ex. 1"
                    error={errors.tokenID !== ""}
                    helperText={errors.tokenID}
                    onChange={(e) => {
                      setTokenID(e.target.value);
                      validateTokenID(e.target.value);
                      setTouched({ ...touched, tokenID: true });
                    }}
                    style={{
                      marginTop: "20px",
                    }}
                    type="number"
                    label="Token ID"
                    variant="outlined"
                />

                <Button
                    variant="contained"
                    onClick={handleClick}
                    className={classes.button}
                    disabled={isButtonEnabled() || isLoading}
                    fullWidth
                    style={{
                      background:
                          isButtonEnabled() || isLoading
                              ? "#e0e0e0"
                              : "#9856EC",
                      color: "#FFFFFF",
                      fontFamily: "Helvetica",
                      fontWeight: 700,
                      textTransform: "none",
                      marginTop: "20px",
                      height: "56px",
                    }}
                >
                  {!isLoading
                      ? "Check My NFT"
                      : "Checking Your NFT... 🔎 🖼️"}
                </Button>
                <div
                    hidden={fetchError === ""}
                    style={{ marginTop: "10px", width: "100%" }}
                >
                  <Alert variant="outlined" severity="error">
                    Error: {fetchError}
                  </Alert>
                </div>
                <div
                    style={{
                      marginTop: "10px",
                      backgroundColor: "#F1F1F1",
                      border: "1px solid #9F9F9F",
                      borderRadius: "3px",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      paddingRight: "10px",
                      paddingLeft: "10px",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      color: "rgba(0, 0, 0, 0.6)",
                    }}
                >
                  <b>
                    Please note that the Check My NFT ratings and site are
                    an MVP.
                  </b>{" "}
                  Low ratings may be inaccurate if the NFT contract utilizes
                  a non-standard storage format for the NFT assets. If you
                  believe that a rating is incorrect, please submit a PR
                  here to fix the rating (
                  <a
                      href="https://github.com/theweaver19/checkmynft"
                      target="_blank"
                      rel="noreferrer"
                  >
                    https://github.com/theweaver19/checkmynft
                  </a>
                  .)
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
  )
}
