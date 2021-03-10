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
import ModalForm from "./components/ModalForm"
import HeroSection from "./components/HeroSection"
import ResultsSection from "./components/ResultsSection"

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

      <ModalForm />

      {!nftInfo.level ? (
        <React.Fragment>
          <HeroSection />
          <HowItWorksSection />
          <TwitterSection />
          <NFTResourcesSection />
          <SupportSection />
          <FooterSection />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ResultsSection />
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
