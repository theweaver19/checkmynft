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
import Arweave from "arweave";
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
        backgroundColor: "#16CA48",
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

// Cryptokitties 0x06012c8cf97bead5deae237070f9587f8e7a266d (no reference to the tokenURI on the contract)
// Hashmasks 0xC2C747E0F7004F9E8817Db2ca4997657a7746928, they don't store any tokenURI on the blockchain (only a hosted webpage with links to)
let knownPoor = [
  "0x06012c8cf97bead5deae237070f9587f8e7a266d".toLowerCase(),
  "0xC2C747E0F7004F9E8817Db2ca4997657a7746928".toLowerCase(),
];

// Cryptopunks (store the info SHA256 of the image on the contract, image is not necessarily stored in a distributed fashion)
let knownMedium = ["0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb".toLowerCase()];

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
        This asset is stored on centralized provider. 💔 😬 Your asset is at
        great risk of loss if the provider goes out of business or if the issuer
        stops payment to the storage provider.
        <br />
        <br />
        Ask your NFT issuer to consider decentralized storage options such as
        IPFS, Sia or even better, Arweave for a permanent storage solution. 💪
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

// then look at the uri itself

const arweave = Arweave.init();

const web3 = new Web3(
  "wss://mainnet.infura.io/ws/v3/a30464df239144d0a8eae3f8a426d03e"
);

// ARWEAVE example: 0xc6b0B290176AaaB958441Dcb0c64ad057cBc39a0
// IPFS example: 0x1dC30B7CBab6ab347D743E0b9FdeEcB553E1c986

let ipfsEndpoint = "https://cloudflare-ipfs.com";
let arweaveEndpoint = "https://arweave.net";

const isIPFSHash = (hash) => {
  if (hash.substring(0, 2) == "Qm") {
    return true;
  }
  return false;
};

const getURLFromURI = async (uri) => {
  try {
    if (!uri) {
      return ["", "undefined"];
    }
    // if correct URI we get the protocol
    let url = new URL(uri);
    // if protocol other IPFS -- get the ipfs hash
    if (url.protocol === "ipfs:") {
      // ipfs://ipfs/Qm
      let cleaned = url.pathname.replace("//", "/");
      return [ipfsEndpoint + cleaned, "ipfs"];
    }

    // otherwise we check if arweave (arweave in the name or arweave.net)
    if (url.hostname === "arweave.net") {
      return [arweaveEndpoint + url.pathname, "arweave"];
    }

    // otherwise it's a centralized uri
    return [uri, "centralized"];
  } catch (e) {
    // it's not a url, we keep checking
    // check if IPFS
    if (isIPFSHash(uri)) {
      return [ipfsEndpoint + uri, "ipfs"];
    }

    try {
      // could be an arweave tx ID, check it
      await arweave.transactions.get(uri);
      return [arweaveEndpoint + uri, "arweave"];
    } catch (e) {
      // otherwise we don't know
      return ["", "undefined"];
    }
  }
};

function App() {
  const classes = useStyles();
  const [nftInfo, setNFTInfo] = useState({
    owner: "",
    tokenURI: "",
    symbol: "",
    name: "",
    image: "",
    address: "",
    tokenID: "",
    protocol: "",
    uriURL: "",
    imageURIURL: "",
  });
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

  const handleClick = async () => {
    try {
      const contract = new web3.eth.Contract(ERC721ABI, nftAddress);

      const owner = await contract.methods.ownerOf(tokenID).call();
      const symbol = await contract.methods.symbol().call();
      const name = await contract.methods.name().call();

      // do something with cryptokitty
      if (knownPoor.includes(nftAddress.toLowerCase())) {
        setNFTInfo({
          level: "poor",
          owner,
          tokenURI: "N/A",
          symbol,
          name,
          image: checkMyNFTImage,
          address: nftAddress,
          tokenID: tokenID,
          protocol: "N/A",
          uriURL: "N/A",
          imageURIURL: "N/A",
        });
      }

      let tokenURI = "";
      // not all of these HAVE token URIs
      try {
        tokenURI = await contract.methods.tokenURI(tokenID).call();
      } catch (e) {
        console.error();
        // if we can't get the URI at this point, it's an undefined???
      }

      let [uriURL, uriProtocol] = await getURLFromURI(tokenURI);

      const uriResponse = await fetch(uriURL, { method: "GET" });

      let uriInfo = await uriResponse.json();
      let imgURI = uriInfo.image;

      let [imageURIURL] = await getURLFromURI(imgURI);

      const imageResponse = await fetch(imageURIURL, { method: "GET" });
      let imageBlob = await imageResponse.blob();
      let image = URL.createObjectURL(imageBlob);

      let severity = undefined;
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
      }

      setNFTInfo({
        level: severity,
        owner,
        tokenURI,
        symbol,
        name,
        image,
        address: nftAddress,
        tokenID: tokenID,
        protocol: uriProtocol,
        uriURL,
        imageURIURL,
      });
    } catch (e) {
      console.error(e);
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
    <div
      className="App"
      style={{
        backgroundColor: "#D8F6FF",
        height: "100%",
        width: "100vw",
      }}
    >
      {!nftInfo.image ? (
        <div>
          <Container style={{ height: "80vh", width: "100vw" }}>
            <Grid
              container
              spacing={3}
              justify="center"
              direction="column"
              alignItems="center"
            >
              <img
                src={checkMyNFT}
                alt="Check My NFT"
                width="391"
                height="50"
                style={{ marginTop: "50px" }}
              />
              <Grid item>
                <Grid container>
                  <Grid item xs></Grid>
                  <Grid item xs={12}>
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
                        <img src={"https://nowhere.hello"} /> 😢
                      </span>
                    </div>

                    <div
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "18px",
                        textAlign: "center",
                      }}
                    >
                      Enter your NFT contract address & token ID to see the
                      strength of your NFT’s assets.
                    </div>
                  </Grid>
                  <Grid item xs></Grid>
                </Grid>
              </Grid>
              <Grid item xs={10} style={{ width: "100%" }}>
                <Paper
                  elevation={0}
                  style={{
                    border: "1px solid #C4C4C4",
                    padding: "20px 40px 40px 40px",
                    width: "100%",
                    borderRadius: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      // padding: "20px",
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
                      Supporting Ethereum NFTs only at this time.
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
                      disabled={isButtonEnabled()}
                      fullWidth
                      style={{
                        background: isButtonEnabled() ? "#e0e0e0" : "#9856EC",
                        color: "#FFFFFF",
                        fontFamily: "Helvetica",
                        fontWeight: 700,
                        textTransform: "none",
                        marginTop: "20px",
                        height: "56px",
                      }}
                    >
                      Check My NFT
                    </Button>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Container>

          <Container
            style={{
              backgroundColor: "rgba(255, 254, 160, 1)",
              width: "100vw",
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
                  }}
                >
                  Some thoughts around NFT asset storage from crypto twitter
                </div>
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <TwitterTweetEmbed
                      tweetId={"1308315853335732224"}
                      options={{
                        conversation: "none",
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TwitterTweetEmbed tweetId={"1363541347689463808"} />
                  </Grid>
                  <Grid item xs={4}>
                    <TwitterTweetEmbed tweetId={"1353370945730306048"} />
                  </Grid>
                  <Grid item xs={4}>
                    <TwitterTweetEmbed tweetId={"1362914198548750336"} />
                  </Grid>
                  <Grid item xs={4}>
                    <TwitterTweetEmbed tweetId={"1362539804236386305"} />
                  </Grid>
                  <Grid item xs={4}>
                    <TwitterTweetEmbed tweetId={"1341827289907146753"} />
                  </Grid>
                  <Grid item xs={4}>
                    <TwitterTweetEmbed tweetId={"1354320520141889540"} />
                  </Grid>
                  <Grid item xs={4}>
                    <TwitterTweetEmbed tweetId={"1319977641252933633"} />
                  </Grid>
                  <Grid item xs={4}>
                    <TwitterTweetEmbed tweetId={"1358080255978782721"} />
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
                  }}
                >
                  Want to learn more about NFTs but aren’t sure where to start?
                  Here are some resources for you!
                </div>
              </Grid>
              <Grid
                item
                style={{ marginTop: "20px" }}
                xs={10}
                style={{ width: "100%" }}
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
                }}
              >
                Have a resource you want to include here? Email us at{" "}
                <a href="mailto:checkmynft@gmail.com">checkmynft@gmail.com</a>.
              </Grid>
            </Grid>
          </Container>
          <Container
            style={{
              height: "40vh",
              backgroundColor: "#D5FFC6",

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
                  Support CheckMyNft.com 🙏{" "}
                </div>
              </Grid>
              <Grid item>
                <div
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontSize: "18px",
                    marginTop: "10px",
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
                    padding: "20px",
                    width: "100%",
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
                            R9tbkcRNGYzstB6kYa4OFdqf2JGU1Mg-qqEd2gDL-g4
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
                            3MPs9i4VwEBfoF5zn5nv9o9BxrNXEQRA9d
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
                            0xa8CC2B4bd58C778a45dEe62Bb0714E2dA37cA95C
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
            style={{
              height: "10vh",
              backgroundColor: "#D8F6FF",
            }}
          >
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ marginTop: "20px" }}
            >
              <IconButton
                onClick={() => {
                  window.open("github.com");
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
        </div>
      ) : (
        <Container style={{ height: "100vh" }}>
          <Grid container spacing={1} direction="column" alignItems="center">
            <img
              src={checkMyNFT}
              alt="Check My NFT"
              width="391"
              height="50"
              style={{ marginTop: "20px" }}
            />
            <Grid item xs={10} style={{ width: "100%" }}>
              <Paper
                elevation={0}
                style={{
                  border: "1px solid #C4C4C4",
                  padding: "20px",
                  width: "100%",
                  borderRadius: "20px",
                }}
              >
                <Grid container spacing={1}>
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
                          width: "350px",
                          height: "16px",
                          borderRadius: "20px",
                          marginBottom: "30px",
                        }}
                      />
                    </div>
                    {nftInfo.level ? levels[nftInfo.level].text : ""}
                  </Grid>
                  <Grid item xs={4}>
                    <img
                      src={nftInfo.image === "" ? "" : nftInfo.image}
                      style={{ maxWidth: "244px", maxHeight: "285px" }}
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
                  padding: "20px",
                  width: "100%",
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
                  padding: "20px",
                  width: "100%",
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
                            href="#"
                            href={`https://etherscan.io/address/${nftInfo.owner}`}
                            target="_blank"
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
              }}
              style={{
                color: "rgba(152, 86, 236, 1)",
                marginBottom: "20px",
                fontFamily: "Poppins",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              Check another NFT
            </Link>
          </Grid>
        </Container>
      )}
    </div>
  );
}

export default App;
