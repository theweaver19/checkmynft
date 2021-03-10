import React from "react";
import {Container} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import {arweaveEndpoint, deployToIPFS, getArweaveIDByCID, ipfsGetEndpoint, walkIPFSLinks} from "../utils"
import checkMyNFT from "../images/logo.png";
import Paper from "@material-ui/core/Paper"
import LinearProgress from "@material-ui/core/LinearProgress"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import Link from "@material-ui/core/Link"
import Button from "@material-ui/core/Button"
import { capitalize } from "@material-ui/core"; // todo check

export default function ResultsSection(props) {
  let {
    classes,
    imageInfo,
    setImageInfo,
    setNFTAddress,
    setOpen,
    setTokenID,
    nftInfo,
    setNFTInfo,
    setArweaveMetadataUploadedURL,
    setArweaveImageUploadedURL,
    setErrors,
    setFetchError
  } = props.componentProps;

  let defaultErrors = {
    nftAddress: "",
    tokenID: "",
  };

  const levels = {
    strong: {
      barColor: "#16CA48",
      barClass: "loaderStrong",
      title: "Strong 💚",
      level: 100,
      text: (
          <div>
            Your asset storage strength is strong and couldn’t be better 💚 <br />
            <br /> This asset has been saved on Arweave which ensures permanent
            availability of your asset. <br />
            <br />
            Wow. Very good NFT. So forever. 🌈 🐕
          </div>
      ),
    },
    medium: {
      barColor: "rgba(237, 216, 32, 1)",
      title: "Medium 💛",
      barClass: "loaderMedium",
      level: 50,
      text: (
          <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                paddingRight: "40px",
              }}
          >
            Your asset is stored on a decentralized provider, that’s great! 💛
            <br />
            <br />
            Asset strength is Medium because long term permanence of the asset is
            not guaranteed. The asset requires ongoing renewal and payment of the
            storage contract or it will be permanently lost 😢 <br /> <br /> Ask
            your NFT issuer to upload the asset to Arweave to ensure permanence.
          </div>
      ),
    },
    poor: {
      barColor: "#FF6161",
      title: "Poor 💔",
      barClass: "loaderPoor",
      level: 10,
      text: (
          <div>
            This asset is either stored on a centralized provider or there might not
            be a link between your NFT and the asset on chain. 💔 😬 Your asset is
            at great risk of loss if the provider goes out of business, if the
            issuer stops payment to the storage provider or if the link between your
            NFT and the assets breaks (for example, if the link is stored on a
            centralized website).
            <br />
            <br />
            Ask your NFT issuer to consider decentralized storage options such as
            IPFS or even better, Arweave for a permanent storage solution. 💪
          </div>
      ),
    },
    undefined: {
      barColor: "rgba(196, 196, 196, 1)",
      barClass: "loaderUndefined",
      level: 0,
      title: "Undefined ❔",
      text: (
          <div>
            Your asset storage type and strength could not be identified from the
            information provided.
          </div>
      ),
    },
  };

  const handleUploadToArweaveClick = async () => {
    setOpen(true);
    try {
      let metadataCID = await walkIPFSLinks(
          nftInfo.uriURL.replace(ipfsGetEndpoint, "").split("/")[0]
      );
      let imageCID = await walkIPFSLinks(
          imageInfo.imageURIURL.replace(ipfsGetEndpoint, "").split("/")[0]
      );
      // upload
      console.log("deploying metadata");
      await deployToIPFS(metadataCID);
      console.log("deploying image");
      await deployToIPFS(imageCID);
      // We wait 5 seconds to ensure the graphql endpoint updates
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 5000);
      });
      console.log("getting metadata CID");
      let arweaveMetadatadaID = await getArweaveIDByCID(metadataCID);
      setArweaveMetadataUploadedURL(
          arweaveEndpoint + "/" + arweaveMetadatadaID
      );

      console.log("getting image CID");
      let arweaveImageCID = await getArweaveIDByCID(imageCID);
      setArweaveImageUploadedURL(arweaveEndpoint + "/" + arweaveImageCID);


      // await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 3000);
      // });
      // setArweaveMetadataUploadedURL("https://example.com");
      // await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 3000);
      // });
      // setArweaveImageUploadedURL("https://example.com");
    } catch (e) {
      setOpen(false);
      console.error(e);
    }
  };

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
                // setImageInfo(defaultImgState); // todo check
                setImageInfo(imageInfo);
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
                // setImageInfo(defaultImgState); // todo check
                setImageInfo(imageInfo);
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
