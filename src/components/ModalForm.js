import React from "react";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Check } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import { Backdrop } from "@material-ui/core";
import arweaveDeployment from "../images/arweave_deployment.png";
import { arweaveEndpoint, createTweet } from "../utils";

export default function ModalForm(props) {
  let {
    classes,
    open,
    setOpen,
    nftInfo,
    arweaveMetadataUploadedURL,
    arweaveImageUploadedURL,
  } = props.componentProps;

  return (
    <Modal
      open={open}
      onClose={setOpen}
      BackdropComponent={Backdrop}
      className={classes.modal}
    >
      <Fade in={open}>
        {arweaveImageUploadedURL === "" || arweaveMetadataUploadedURL === "" ? (
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
              Your NFT has been saved on Arweave! You just ensured the longevity
              of your artwork. Great job!
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
                  : arweaveImageUploadedURL.replace(arweaveEndpoint + "/", "")}
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
  );
}
