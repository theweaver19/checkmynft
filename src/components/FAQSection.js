import React from "react";
import { Container, Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

export default function FAQSection() {
  return (
    <Container
      style={{
        backgroundColor: "#D5FFC6",
        maxWidth: "100%",
      }}
    >
      <Grid container justify="center" direction="column" alignItems="center">
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
            FAQs 🤔
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
            Frequently asked questions about CheckMyNFT and NFT metadata storage
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
              My NFT is not searchable on CheckMyNFT even though it’s an
              ERC-721.
            </div>

            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              For most NFTs, CheckMyNFT primarily looks at the token URI field
              to assess the strength of the token metadata. If the NFT has not
              used the token URI field to store the metadata, we may be unable
              to provide a result. This may occur due to inconsistent metadata
              storage practices used by various NFT minting platforms,
              developers and artist preferences.
              <br />
              <br />
              In such a case, you should review the “Read Contract” fields in
              Etherscan to see which fields relate to the token metadata (i.e.
              look for fields such as tokenIPFShash, getArweaveImgHash, or other
              similar fields).
            </div>
          </Paper>

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
              My NFT is showing a poor rating even though it uses best practices
              for metadata storage such as Arweave or onchain storage.
            </div>

            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              CheckMyNFT is an MVP and as such, we presently look at a limited
              set of data to assess the strength of the NFT’s metadata. Some
              tokens use non-standard fields outside of the token URI field and
              in such a case, the metadata may not be linked to the fields we
              assess. Ratings may be inaccurate if the NFT contract utilizes a
              non-standard storage format for the NFT assets. You should
              validate any results yourself by checking under “Read Contract” in
              Etherscan to see if any other fields relate to the token metadata
              (i.e. look for fields such as tokenIPFShash, getArweaveImgHash, or
              other similar fields).
              <br />
              <br />
              CheckMyNFT is open source so if you believe that a rating is
              incorrect, please submit a PR{" "}
              <a
                href="https://github.com/theweaver19/checkmynft"
                target="_blank"
              >
                here
              </a>
                {" "}
              to fix the rating.
            </div>
          </Paper>

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
              Where can I find the contract address and token ID?
            </div>

            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              NFT platforms and marketplaces will typically make this
              information available to you on each NFT’s individual page. You
              can also find this information on the Etherscan page for your
              wallet under ERC-721 tokens.
              <br />
              <br />
              For example, here's a{" "}
              <a
                href="https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/140082"
                target="_blank"
              >
                Bored Elon
              </a>{" "}
              token on Open Sea. If you look under “Chain Info” you can see the
              Contract Address and Token ID. The Contract Address refers to the
              address where the contract is deployed on Ethereum. The Token ID
              refers to this specific NFT.
              <br />
              <br />
              Contract address: <a href="https://etherscan.io/address/0xd07dc4262bcdbf85190c01c996b4c06a461d2430" target="_blank">0xd07dc4262BCDbf85190C01c996b4C06a461d2430</a>
              <br />
              <br />
              Token ID: 140082
            </div>
          </Paper>
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
              What should I do if I’m worried about how my NFTs data is stored?
            </div>

            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              The first step is getting informed, so it’s good that you are
              here!
              <br />
              <br />
              You should reach out to the artist and/or NFT platform to see if
              they are willing to take any steps to add redundancy to the NFT
              metadata. Ideally the NFT minting platforms provide options for
              artists and collectors to permanently backup the created and
              purchased NFTs.
              <br />
              <br />
              In the meantime, you can also individually backup the metadata
              yourself through checkmynft.com and our use of ipfs2arweave.com.
            </div>
          </Paper>
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
              I want support added for NFTs from a different chain.
            </div>

            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              Right now, CheckMyNFT only supports ERC-721 NFTs. If you’d like
              NFTs from another chain to be searchable, we welcome open source
              contributions to add this support!
              <br />
              <br />
              Please submit your PR to add support for other blockchains{"  "}
              <a
                href="https://github.com/theweaver19/checkmynft"
                target="_blank"
              >
                here
              </a>
              .
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
  );
}
