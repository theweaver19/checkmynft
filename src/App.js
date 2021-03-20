import "./App.css";
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

let defaultImgState = {
  imageURIURL: "",
  image: checkMyNFTImage,
  loading: false,
};

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
            }}
          />
          <HowItWorksSection />
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
            }}
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
