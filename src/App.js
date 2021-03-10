import "./App.css";
import {
  Backdrop,
  Button,
  capitalize,
  CircularProgress,
  Container,
  Fade,
  IconButton,
  LinearProgress,
  Link,
  Modal,
  Paper,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import checkMyNFT from "./images/logo.png";
import Web3 from "web3";
import { ERC721ABI } from "./ERC721ABI";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import github from "./images/github.png";
import twitter from "./images/twitter.png";
import eth from "./images/eth.png";
import checkMyNFTImage from "./images/checkMyNFT.png";
import { Alert } from "@material-ui/lab";
import arweaveDeployment from "./images/arweave_deployment.png";
import {
  getURLFromURI,
  getArweaveIDByCID,
  arweaveEndpoint,
  ipfsGetEndpoint,
  knownGood,
  knownPoor,
  walkIPFSLinks,
  createTweet,
  deployToIPFS,
} from "./utils";
import { Check } from "@material-ui/icons";
import TwitterSection from "./components/TwitterSection";
import HowItWorksSection from "./components/HowItWorksSection"
import NFTResourcesSection from "./components/NFTResourcesSection"
import FooterSection from "./components/FooterSection"
import SupportSection from "./components/SupportSection"

// TODO -- check if IPFS has exists on arweave
// TODO add tutorial to upload to arweave

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    loaderStrong: {
      backgroundColor: "rgba(196, 196, 196, 1)",
      "& .MuiLinearProgress-barColorPrimary": {
        backgroundColor: "#16CA48",
      },
    },
    loaderMedium: {
      backgroundColor: "rgba(196, 196, 196, 1)",
      "& .MuiLinearProgress-barColorPrimary": {
        backgroundColor: "#EDD820",
      },
    },
    loaderPoor: {
      backgroundColor: "rgba(196, 196, 196, 1)",
      "& .MuiLinearProgress-barColorPrimary": {
        backgroundColor: "#FF6161",
      },
    },
    loaderUndefined: {
      backgroundColor: "rgba(196, 196, 196, 1)",
      "& .MuiLinearProgress-barColorPrimary": {
        backgroundColor: "#C4C4C4",
      },
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: "20px",
      padding: theme.spacing(4, 4, 4, 4),
      outline: "none",
    },
  })
);

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

var wssOptions = {
  timeout: 30000, // ms

  clientConfig: {
    // Useful if requests are large
    maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
    maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

    // Useful to keep a connection alive
    keepalive: true,
    keepaliveInterval: 60000, // ms
  },

  // Enable auto reconnection
  reconnect: {
    auto: true,
    delay: 5000, // ms
    maxAttempts: 5,
    onTimeout: false,
  },
};

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://mainnet.infura.io/ws/v3/a30464df239144d0a8eae3f8a426d03e",
    wssOptions
  )
);

let defaultImgState = {
  imageURIURL: "",
  image: checkMyNFTImage,
  loading: false,
};
let defaultErrors = {
  nftAddress: "",
  tokenID: "",
};

function App() {
  const classes = useStyles();
  const [nftInfo, setNFTInfo] = useState({
    owner: "",
    tokenURI: "",
    symbol: "",
    name: "",
    address: "",
    tokenID: "",
    protocol: "",
    uriURL: "",
  });

  const [imageInfo, setImageInfo] = useState(defaultImgState);
  const [errors, setErrors] = useState({
    nftAddress: "",
    tokenID: "",
  });
  const [touched, setTouched] = useState({
    nftAddress: false,
    tokenID: false,
  });
  const [nftAddress, setNFTAddress] = useState("");
  const [tokenID, setTokenID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [open, setOpen] = useState(false);
  const [arweaveMetadataUploadedURL, setArweaveMetadataUploadedURL] = useState(
    ""
  );
  const [arweaveImageUploadedURL, setArweaveImageUploadedURL] = useState("");

  const validateAddress = (address) => {
    if (address.length === 40 || address.length === 42) {
      setErrors({ ...errors, nftAddress: "" });
      return;
    }
    setErrors({ ...errors, nftAddress: "Invalid address" });
  };

  const validateTokenID = (tokenID) => {
    if (+tokenID < 0) {
      setErrors({ ...errors, tokenID: "TokenID cannot be negative" });
      return;
    }
    setErrors({ ...errors, tokenID: "" });
  };

  const tryToGetTokenURI = async (contract, id) => {
    let tokenURI = "";
    let error = "";
    try {
      // this is proper ERC721 compatible
      tokenURI = await contract.methods.tokenURI(id).call();
    } catch (e) {
      error = e.message;
      try {
        // this is NOT proper ERC721 but Rarible has this
        tokenURI = await contract.methods.uri(id).call();
        error = "";
      } catch (e) {
        error = e.message;
      }
    }
    return [tokenURI, error];
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

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const contract = new web3.eth.Contract(ERC721ABI, nftAddress);

      let owner = "";
      try {
        // this is proper ERC721 compatible
        owner = await contract.methods.ownerOf(tokenID).call();
      } catch (e) {
        console.error(e);
      }

      const symbol = await contract.methods.symbol().call();
      const name = await contract.methods.name().call();

      if (knownPoor.includes(nftAddress.toLowerCase())) {
        setNFTInfo({
          level: "poor",
          owner,
          tokenURI: "N/A",
          symbol,
          name,
          address: nftAddress,
          tokenID: tokenID,
          protocol: "N/A",
          uriURL: "N/A",
        });
        setImageInfo(defaultImgState);
        return;
      }
      let [tokenURI, err] = await tryToGetTokenURI(contract, tokenID);
      if (err !== "") {
        console.error(err);
        setFetchError("Could not fetch token URI for NFT " + tokenURI);
        setIsLoading(false);
        return;
      }

      let [uriURL, uriProtocol] = await getURLFromURI(tokenURI);

      let uriResponse;
      try {
        uriResponse = await fetch(uriURL, { method: "GET" });
      } catch (e) {
        console.error(e);
        setFetchError("Could not fetch NFT URI " + tokenURI);
        setIsLoading(false);
        return;
      }

      let uriInfo = await uriResponse.json();
      let imgURI = uriInfo.image;

      let [imageURIURL, protocol] = await getURLFromURI(imgURI);

      let isImageOnArweave = false;
      let isMetadataOnArweave = false;

      // if the protocol is on IPFS, we check if the tokenURI AND the imageURI are stored on Arweave via ipfs2arweave.com
      if (protocol === "ipfs") {
        let metadataCID = uriURL.replace(ipfsGetEndpoint, "");
        let rootMetadataCID = metadataCID.split("/");
        if (rootMetadataCID.length !== 0) {
          rootMetadataCID = await walkIPFSLinks(rootMetadataCID[0]);
        }

        let imageCID = imageURIURL.replace(ipfsGetEndpoint, "");
        let rootImageCID = imageCID.split("/");
        if (rootImageCID.length !== 0) {
          rootImageCID = await walkIPFSLinks(rootImageCID[0]);
        }

        try {
          // We check to see if the IPFS hash is stored on arweave
          let arweaveImageID = await getArweaveIDByCID(rootImageCID);
          if (arweaveImageID !== "") {
            //  we change the imageURIURL to the arweaveImageID
            imageURIURL = arweaveEndpoint + "/" + arweaveImageID;
            isImageOnArweave = true;
          }
          let arweaveMetadataID = await getArweaveIDByCID(rootMetadataCID);
          if (arweaveMetadataID !== "") {
            tokenURI = arweaveEndpoint + "/" + arweaveMetadataID;
            isMetadataOnArweave = true;
          }
        } catch (e) {
          console.log(e);
        }
      }

      setImageInfo({ ...imageInfo, loading: true });

      fetch(imageURIURL, { method: "GET" })
        .then(async (imageResponse) => {
          let imageBlob = await imageResponse.blob();
          let image = URL.createObjectURL(imageBlob);
          setImageInfo({
            imageURIURL: imageURIURL,
            image: image,
            loading: false,
          });
        })
        .catch((e) => {
          console.error(e);
          setFetchError("Could not fetch NFT Image " + imgURI);
          setIsLoading(false);
        });

      let severity = "undefined";
      switch (uriProtocol) {
        case "ipfs":
          severity = "medium";
          break;
        case "arweave":
          severity = "strong";
          break;
        case "centralized":
          severity = "poor";
          break;
        default:
          severity = "undefined";
      }

      if (knownGood.includes(nftAddress.toLowerCase())) {
        setNFTInfo({
          level: "strong",
          owner,
          tokenURI,
          symbol,
          name,
          address: nftAddress,
          tokenID: tokenID,
          protocol: "On-chain",
          uriURL,
        });
        setIsLoading(false);
        return;
      }
      if (protocol === "ipfs" && isImageOnArweave && isMetadataOnArweave) {
        setNFTInfo({
          level: "strong",
          owner,
          tokenURI,
          symbol,
          name,
          address: nftAddress,
          tokenID: tokenID,
          protocol: "Arweave & IPFS",
          uriURL,
        });
        setIsLoading(false);
        return;
      }

      setNFTInfo({
        level: severity,
        owner,
        tokenURI,
        symbol,
        name,
        address: nftAddress,
        tokenID: tokenID,
        protocol: uriProtocol,
        uriURL,
      });
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setFetchError(e.message);
      setIsLoading(false);
    }
  };

  const isButtonEnabled = () => {
    return (
      !touched.nftAddress ||
      !touched.tokenID ||
      errors.nftAddress !== "" ||
      errors.tokenID !== ""
    );
  };

  return (
    <div className="App" style={{}}>
      <Modal
        open={open}
        onClose={setOpen}
        BackdropComponent={Backdrop}
        className={classes.modal}
      >
        <Fade in={open}>
          {arweaveImageUploadedURL === "" ||
          arweaveMetadataUploadedURL === "" ? (
            <div className={classes.paper}>
              <div
                style={{
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  fontWeight: 600,
                  textAlign: "center",
                  marginBottom: "40px",
                }}
              >
                Hang tight!
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size={60} style={{ color: "#9856EC" }} />
              </div>
              <div
                style={{
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontWeight: 400,
                  textAlign: "center",
                  maxWidth: "470px",
                  marginTop: "40px",
                }}
              >
                Your NFT is being uploaded to the permaweb!
                <div>
                  Token metadata:{" "}
                  {arweaveMetadataUploadedURL !== "" ? (
                    <Check style={{ color: "green" }} />
                  ) : (
                    "Uploading..."
                  )}{" "}
                </div>
                <div>
                  Token Image:{" "}
                  {arweaveImageUploadedURL !== "" ? (
                    <Check style={{ color: "green" }} />
                  ) : (
                    "Uploading..."
                  )}{" "}
                </div>
                <br />
                Just a few seconds left until immortality 🌈
              </div>
              <br />
            </div>
          ) : (
            <div className={classes.paper}>
              <div
                style={{
                  fontFamily: "Poppins",
                  fontSize: "24px",
                  fontWeight: 600,
                  textAlign: "center",
                  marginBottom: "40px",
                  color: "#16CA48",
                }}
              >
                Success! 🎉
              </div>
              <div
                style={{
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontWeight: 400,
                  textAlign: "center",
                  maxWidth: "470px",
                  marginTop: "40px",
                }}
              >
                Your NFT has been saved on Arweave! You just ensured the
                longevity of your artwork. Great job!
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <img src={arweaveDeployment} alt="Deployment" />
              </div>
              <div
                style={{
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontWeight: 400,
                  textAlign: "center",
                  maxWidth: "470px",
                  marginTop: "40px",
                  color: "rgba(0, 0, 0, 0.25)",
                }}
              >
                Arweave Metadata TX ID:{" "}
                <a
                  href={arweaveMetadataUploadedURL}
                  alt="metadata"
                  target="_blank"
                  rel="noreferrer"
                >
                  {arweaveMetadataUploadedURL === ""
                    ? ""
                    : arweaveMetadataUploadedURL.replace(
                        arweaveEndpoint + "/",
                        ""
                      )}
                </a>
                <br />
                Arweave Image TX ID:{" "}
                <a
                  href={arweaveImageUploadedURL}
                  alt="Image URL"
                  target="_blank"
                  rel="noreferrer"
                >
                  {arweaveImageUploadedURL === ""
                    ? ""
                    : arweaveImageUploadedURL.replace(
                        arweaveEndpoint + "/",
                        ""
                      )}
                </a>
              </div>

              <div
                style={{
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontWeight: 400,
                  textAlign: "center",
                  maxWidth: "470px",
                  marginTop: "40px",
                }}
              >
                Share the news to help other artists and collectors learn about
                this service!
              </div>

              <a
                onClick={() => setOpen(false)}
                style={{
                  textTransform: "none",
                  textDecoration: "none",
                }}
                target="_blank"
                rel="noreferrer"
                href={createTweet(nftInfo.address, nftInfo.tokenID)}
              >
                <Button
                  variant="contained"
                  className={classes.button}
                  fullWidth
                  style={{
                    background: "rgba(29, 161, 242, 1)",
                    color: "#FFFFFF",
                    fontFamily: "Helvetica",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "21px",
                    marginTop: "20px",
                    height: "56px",
                  }}
                >
                  Tweet
                </Button>
              </a>
            </div>
          )}
        </Fade>
      </Modal>
      {!nftInfo.level ? (
        <React.Fragment>
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

          <HowItWorksSection />

          <TwitterSection />

          <NFTResourcesSection />

          <SupportSection />

          <FooterSection />

        </React.Fragment>
      ) : (
        <React.Fragment>
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
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
