import "./App.css";
import Web3 from "web3";
import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import checkMyNFTImage from "./images/checkMyNFT.png";
import TwitterSection from "./components/TwitterSection";
import HowItWorksSection from "./components/HowItWorksSection";
import NFTResourcesSection from "./components/NFTResourcesSection";
import FooterSection from "./components/FooterSection";
import SupportSection from "./components/SupportSection";
import ModalForm from "./components/ModalForm";
import HeroSection from "./components/HeroSection";
import ResultsSection from "./components/ResultsSection";
import FeaturedInSection from "./components/FeaturedInSection";
import WhatIsMetadataSection from "./components/WhatIsMetadataSection";
import FAQSection from "./components/FAQSection";
import {
  getConnectedChainInfo
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

let defaultImgState = {
  imageURIURL: "",
  image: checkMyNFTImage,
  loading: false,
};


let wssOptions = {
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

let web3;
let connectedChainInfo;
(() => {
  if(window.ethereum)
{
  connectedChainInfo = getConnectedChainInfo(window.ethereum.networkVersion)

  web3 = new Web3(window.ethereum);
  console.log("0")
}
else
{
  connectedChainInfo = getConnectedChainInfo('1')
  web3 = new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://mainnet.infura.io/ws/v3/a30464df239144d0a8eae3f8a426d03e",
      wssOptions
    )
  );

}
})();

function App() {
  // used in hero results and modal
  const classes = useStyles();
  const [tokenID, setTokenID] = useState("");
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

  // used in hero and results
  const [imageInfo, setImageInfo] = useState(defaultImgState);
  const [nftAddress, setNFTAddress] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [errors, setErrors] = useState({
    nftAddress: "",
    tokenID: "",
  });

  // used in modal and results
  const [open, setOpen] = useState(false);
  const [arweaveMetadataUploadedURL, setArweaveMetadataUploadedURL] = useState(
    ""
  );
  const [arweaveImageUploadedURL, setArweaveImageUploadedURL] = useState("");

  return (
    <div className="App" style={{}}>
      <ModalForm
        componentProps={{
          classes,
          open,
          setOpen,
          arweaveMetadataUploadedURL,
          arweaveImageUploadedURL,
          nftInfo,
        }}
      />

      {!nftInfo.level ? (
        <React.Fragment>
          <HeroSection
            componentProps={{
              classes,
              imageInfo,
              setImageInfo,
              nftAddress,
              setNFTAddress,
              tokenID,
              setTokenID,
              nftInfo,
              setNFTInfo,
              errors,
              setErrors,
              fetchError,
              setFetchError,
              web3,
              connectedChainInfo
            }}
          />
          <FeaturedInSection />
          <WhatIsMetadataSection />
          <HowItWorksSection />
          <FAQSection componentProps={{
            connectedChainInfo
          }}/>
          <TwitterSection />
          <NFTResourcesSection />
          <SupportSection />
          <FooterSection />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ResultsSection
            componentProps={{
              classes,
              imageInfo,
              setImageInfo,
              setNFTAddress,
              setOpen,
              setArweaveMetadataUploadedURL,
              setArweaveImageUploadedURL,
              setTokenID,
              nftInfo,
              setNFTInfo,
              setErrors,
              setFetchError,
              connectedChainInfo
            }}
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
