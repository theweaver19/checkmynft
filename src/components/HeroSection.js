import React, { useState } from "react";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { ERC721ABI } from "../ERC721ABI";
import {
  arweaveEndpoint,
  getArweaveIDByCID,
  getURLFromURI,
  HashmasksAddress,
  ipfsGetEndpoint,
  knownGood,
  knownPoor,
  walkIPFSLinks,
  HashmaskDatastoreABI,
  HashmaskDatastoreAddress,
  deployToIPFS,
} from "../utils";
import Web3 from "web3";
import checkMyNFT from "../images/logo.png";
import eth from "../images/eth.png";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
const bs58 = require("bs58");

export default function HeroSection(props) {
  let {
    classes,
    imageInfo,
    setImageInfo,
    nftAddress,
    setNFTAddress,
    tokenID,
    setTokenID,
    setNFTInfo,
    errors,
    setErrors,
    fetchError,
    setFetchError,
  } = props.componentProps;

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

  const [touched, setTouched] = useState({
    nftAddress: false,
    tokenID: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const web3 = new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://mainnet.infura.io/ws/v3/a30464df239144d0a8eae3f8a426d03e",
      wssOptions
    )
  );

  const validateTokenID = (tokenID) => {
    if (+tokenID < 0) {
      setErrors({ ...errors, tokenID: "TokenID cannot be negative" });
      return;
    }
    setErrors({ ...errors, tokenID: "" });
  };

  const validateAddress = (address) => {
    if (address.length === 40 || address.length === 42) {
      setErrors({ ...errors, nftAddress: "" });
      return;
    }
    setErrors({ ...errors, nftAddress: "Invalid address" });
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

  const isButtonEnabled = () => {
    return (
      !touched.nftAddress ||
      !touched.tokenID ||
      errors.nftAddress !== "" ||
      errors.tokenID !== ""
    );
  };

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const contract = new web3.eth.Contract(ERC721ABI, nftAddress);

      let owner = "";
      try {
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
        // setImageInfo(defaultImgState); // todo check
        setImageInfo(imageInfo);
        return;
      }

      if (nftAddress.toLowerCase() === HashmasksAddress.toLowerCase()) {
        // 0xC2C747E0F7004F9E8817Db2ca4997657a7746928 224
        let hmContract = new web3.eth.Contract(
          HashmaskDatastoreABI,
          HashmaskDatastoreAddress
        );
        let ipfsCIDInHex = await hmContract.methods
          .getIPFSHashHexAtIndex(tokenID)
          .call();
        const bytes = Buffer.from(ipfsCIDInHex.replace("0x", ""), "hex");
        const ipfsCID = bs58.encode(bytes);

        let arweaveImageID = await getArweaveIDByCID(ipfsCID);

        if (arweaveImageID === "") {
          try {
            await deployToIPFS(ipfsCID);
            console.log("deployed");
          } catch (e) {
            console.log(e);
          }
        }

        let [imageURIURL] = await getURLFromURI(arweaveImageID);
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

        setNFTInfo({
          level: "strong",
          owner,
          tokenURI: arweaveEndpoint + "/" + arweaveImageID,
          symbol,
          name,
          address: nftAddress,
          tokenID: tokenID,
          protocol: "Arweave",
          uriURL: arweaveEndpoint + "/" + arweaveImageID,
        });
        setImageInfo(imageInfo);
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
                Enter your NFT contract address & token ID to see the strength
                of your NFT’s assets.
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
                Supporting Ethereum NFTs (ERC-721 Compatible) only at this time.
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
                    isButtonEnabled() || isLoading ? "#e0e0e0" : "#9856EC",
                  color: "#FFFFFF",
                  fontFamily: "Helvetica",
                  fontWeight: 700,
                  textTransform: "none",
                  marginTop: "20px",
                  height: "56px",
                }}
              >
                {!isLoading ? "Check My NFT" : "Checking Your NFT... 🔎 🖼️"}
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
                  Please note that the Check My NFT ratings and site are an MVP.
                </b>{" "}
                Low ratings may be inaccurate if the NFT contract utilizes a
                non-standard storage format for the NFT assets. If you believe
                that a rating is incorrect, please submit a PR here to fix the
                rating (
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
  );
}
