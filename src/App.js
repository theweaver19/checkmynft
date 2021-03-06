import "./App.css";
import {
  Button,
  capitalize,
  Container,
  IconButton,
  LinearProgress,
  Link,
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
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Alert } from "@material-ui/lab";
import {
  getURLFromURI,
  checkIfOnArweave,
  arweaveEndpoint,
  ipfsGetEndpoint,
  knownGood,
  knownPoor,
  walkIPFSLinks,
} from "./utils";


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
          let arweaveImageID = await checkIfOnArweave(rootImageCID);
          if (arweaveImageID !== "") {
            //  we change the imageURIURL to the arweaveImageID
            imageURIURL = arweaveEndpoint + "/" + arweaveImageID;
            isImageOnArweave = true;
          }
          let arweaveMetadataID = await checkIfOnArweave(rootMetadataCID);
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
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Container>
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
                  Support CheckMyNFT.com 🙏{" "}
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
                  If you enjoyed this service and want to support further
                  development, please consider tipping.
                </div>
              </Grid>

              <Grid item style={{ marginTop: "20px", width: "100%" }} xs={10}>
                <Paper
                  elevation={0}
                  style={{
                    border: "1px solid #C4C4C4",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    borderRadius: "20px",
                    marginBottom: "40px",
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
                    Where to Support CheckMyNFT.com
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
                            Arweave:
                          </TableCell>
                          <TableCell
                            style={{
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              border: "none",
                            }}
                          >
                            <a
                              href="https://viewblock.io/arweave/address/R9tbkcRNGYzstB6kYa4OFdqf2JGU1Mg-qqEd2gDL-g4"
                              rel="noreferrer"
                              target="_blank"
                            >
                              R9tbkcRNGYzstB6kYa4OFdqf2JGU1Mg-qqEd2gDL-g4
                            </a>
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
                            Bitcoin:
                          </TableCell>
                          <TableCell
                            style={{
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              border: "none",
                            }}
                          >
                            <a
                              href="https://www.blockchain.com/btc/address/3MPs9i4VwEBfoF5zn5nv9o9BxrNXEQRA9d"
                              // rel="noreferrer"
                              target="_blank"
                            >
                              3MPs9i4VwEBfoF5zn5nv9o9BxrNXEQRA9d
                            </a>
                          </TableCell>
                        </TableRow>
                        <TableRow key={"eth"} scope="row">
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
                            Eth:
                          </TableCell>
                          <TableCell
                            style={{
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              border: "none",
                            }}
                          >
                            <a
                              href="https://etherscan.io/address/0xa8CC2B4bd58C778a45dEe62Bb0714E2dA37cA95C"
                              rel="noreferrer"
                              target="_blank"
                            >
                              0xa8CC2B4bd58C778a45dEe62Bb0714E2dA37cA95C
                            </a>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Container>
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
                  </Grid>
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
