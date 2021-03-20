import React from "react";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

export default function SupportSection() {
  return (
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
            If you enjoyed this service and want to support further development,
            please consider tipping.
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
                        rel="noreferrer"
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
  );
}
