import React from "react";
import {Container} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"

export default function ResultsSection() {
  return (
      <Container>
        <Grid
            container
            spacing={1}
            direction="column"
            alignItems="center"
            alignContent="center"
            // style={{ height: "100%" }}
        >
          <img
              src={checkMyNFT}
              alt="Check My NFT"
              width="391"
              height="50"
              onClick={() => {
                setNFTInfo({});
                setImageInfo(defaultImgState);
                setErrors(defaultErrors);
                setNFTAddress("");
                setTokenID("");
                setFetchError("");
              }}
              style={{ marginTop: "20px", objectFit: "contain" }}
          />
          <Grid item xs={10} style={{ width: "100%" }}>
            <Paper
                elevation={0}
                style={{
                  border: "1px solid #C4C4C4",
                  // padding: "20px",
                  width: "100%",
                  borderRadius: "20px",
                }}
            >
              <Grid
                  container
                  spacing={1}
                  justify="center"
                  style={{
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
              >
                <Grid item xs={8}>
                  <div
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        fontSize: "24px",
                        marginBottom: "10px",
                      }}
                  >
                    Asset Strength
                  </div>
                  <div
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        fontSize: "24px",
                        color: levels[nftInfo.level].barColor,
                      }}
                  >
                    {nftInfo.level ? levels[nftInfo.level].title : ""}
                    <LinearProgress
                        variant="determinate"
                        value={levels[nftInfo.level].level}
                        className={classes[levels[nftInfo.level].barClass]}
                        style={{
                          maxWidth: "350px",
                          height: "16px",
                          objectFit: "contain",
                          borderRadius: "20px",
                          marginBottom: "30px",
                        }}
                    />
                  </div>
                  {nftInfo.level ? levels[nftInfo.level].text : ""}
                </Grid>
                <Grid item md={4}>
                  <img
                      src={
                        imageInfo.loading
                            ? "https://media2.giphy.com/media/l0HUpt2s9Pclgt9Vm/giphy.gif?cid=ecf05e478r36mt7gmdsucy9877jyl8v19xr736c25phpkt2l&rid=giphy.gif"
                            : imageInfo.image
                      }
                      alt="NFT"
                      style={{
                        width: "244px",
                        height: "285px",
                        objectFit: "contain",
                      }}
                  />
                </Grid>
                <Grid item>
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
                    Low ratings may be inaccurate if the NFT contract
                    utilizes a non-standard storage format for the NFT
                    assets. If you believe that a rating is incorrect,
                    please submit a PR here to fix the rating (
                    <a
                        href="https://github.com/theweaver19/checkmynft"
                        target="_blank"
                        rel="noreferrer"
                    >
                      https://github.com/theweaver19/checkmynft
                    </a>
                    .)
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {nftInfo.protocol === "ipfs" ? (
              <Grid item xs={10} style={{ width: "100%" }}>
                <Paper
                    elevation={0}
                    style={{
                      border: "1px solid #C4C4C4",
                      // padding: "20px",
                      backgroundColor: "#D5FFC6",
                      width: "100%",
                      borderRadius: "20px",
                    }}
                >
                  <Grid
                      container
                      spacing={1}
                      style={{
                        paddingTop: "20px",
                        paddingBottom: "20px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                  >
                    <div
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: 600,
                          fontSize: "18px",
                          marginBottom: "10px",
                        }}
                    >
                      Level up your NFT! Save this NFT asset on Arweave 🖼️
                    </div>
                    <div
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: 400,
                          fontSize: "18px",
                          marginBottom: "10px",
                        }}
                    >
                      Thanks to an community member, you can upload your file
                      that resides on IPFS to Arweave where it will be
                      permanently available!
                      <br />
                      <Button
                          variant="contained"
                          onClick={handleUploadToArweaveClick}
                          className={classes.button}
                          fullWidth
                          style={{
                            background: "#9856EC",
                            color: "#FFFFFF",
                            fontFamily: "Helvetica",
                            fontWeight: 700,
                            textTransform: "none",
                            marginTop: "20px",
                            height: "56px",
                          }}
                      >
                        Upload to Arweave (for free!)
                      </Button>
                      <br />
                      <br />
                      We use{" "}
                      <a
                          href="https://ipfs2arweave.com"
                          target="_blank"
                          rel="noreferrer"
                      >
                        IPFS2Arweave.com
                      </a>{" "}
                      to permanently deploy the asset from IPFS to Arweave. To
                      do this, ipfs2arweave take the asset’s IPFS Hash (both
                      the token URI and the image URI), fetches the data and
                      stores it onto Arweave
                      <br />
                      <br /> Plus, this will boost your NFT Asset score to
                      strong 💪
                    </div>
                  </Grid>
                </Paper>
              </Grid>
          ) : (
              <div></div>
          )}
          <Grid item xs={10} style={{ width: "100%" }}>
            <Paper
                elevation={0}
                style={{
                  border: "1px solid #C4C4C4",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
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
                Asset Storage
              </div>

              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow key={"stored_on"} scope="row">
                      <TableCell
                          style={{
                            color: "rgba(0, 0, 0, 0.25)",
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                            paddingLeft: "0",
                            maxWidth: "100px",
                            width: "100px",
                          }}
                      >
                        Stored on:
                      </TableCell>
                      <TableCell
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                          }}
                      >
                        {capitalize(nftInfo.protocol)}
                      </TableCell>
                    </TableRow>
                    <TableRow key={"uri"} scope="row">
                      <TableCell
                          style={{
                            color: "rgba(0, 0, 0, 0.25)",
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                            maxWidth: "100px",
                            paddingLeft: "0",
                            width: "100px",
                          }}
                      >
                        URI:
                      </TableCell>
                      <TableCell
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                          }}
                      >
                        <a
                            href={nftInfo.uriURL}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                          {nftInfo.tokenURI}
                        </a>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={10} style={{ width: "100%" }}>
            <Paper
                elevation={0}
                style={{
                  border: "1px solid #C4C4C4",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
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
                NFT Details
              </div>

              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow key={"name"} scope="row">
                      <TableCell
                          style={{
                            color: "rgba(0, 0, 0, 0.25)",
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                            paddingLeft: "0",
                            maxWidth: "100px",
                            width: "100px",
                          }}
                      >
                        Name:
                      </TableCell>
                      <TableCell
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                          }}
                      >
                        {nftInfo.name}
                      </TableCell>
                    </TableRow>
                    <TableRow key={"symbol"} scope="row">
                      <TableCell
                          style={{
                            color: "rgba(0, 0, 0, 0.25)",
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                            paddingLeft: "0",
                            maxWidth: "100px",
                            width: "100px",
                          }}
                      >
                        Symbol:
                      </TableCell>
                      <TableCell
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                          }}
                      >
                        {nftInfo.symbol}
                      </TableCell>
                    </TableRow>
                    <TableRow key={"contract"} scope="row">
                      <TableCell
                          style={{
                            color: "rgba(0, 0, 0, 0.25)",
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                            maxWidth: "100px",
                            paddingLeft: "0",
                            width: "100px",
                          }}
                      >
                        Contract:
                      </TableCell>
                      <TableCell
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                          }}
                      >
                        <a
                            href={`https://etherscan.io/address/${nftInfo.address}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                          {nftInfo.address}
                        </a>
                      </TableCell>
                    </TableRow>
                    <TableRow key={"token_id"} scope="row">
                      <TableCell
                          style={{
                            color: "rgba(0, 0, 0, 0.25)",
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                            maxWidth: "100px",
                            paddingLeft: "0",
                            width: "100px",
                          }}
                      >
                        Token ID:
                      </TableCell>
                      <TableCell
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                          }}
                      >
                        <a
                            href={`https://etherscan.io/address/${nftInfo.address}#readContract`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                          {nftInfo.tokenID}
                        </a>
                      </TableCell>
                    </TableRow>
                    <TableRow key={"owned_by"} scope="row">
                      <TableCell
                          style={{
                            color: "rgba(0, 0, 0, 0.25)",
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                            maxWidth: "100px",
                            paddingLeft: "0",
                            width: "100px",
                          }}
                      >
                        Owned By:
                      </TableCell>
                      <TableCell
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            border: "none",
                          }}
                      >
                        <a
                            href={`https://etherscan.io/address/${nftInfo.owner}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                          {nftInfo.owner}
                        </a>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Link
              onClick={() => {
                setNFTInfo({});
                setImageInfo(defaultImgState);
                setErrors(defaultErrors);
                setNFTAddress("");
                setTokenID("");
                setFetchError("");
              }}
              style={{
                color: "rgba(152, 86, 236, 1)",
                marginBottom: "20px",
                marginTop: "10px",
                fontFamily: "Poppins",
                fontSize: "18px",
                fontWeight: 700,
              }}
          >
            Check another NFT
          </Link>
        </Grid>
      </Container>
  )
}
