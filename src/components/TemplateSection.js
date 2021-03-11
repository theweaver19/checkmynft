import React from "react";
import {Container} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"

export default function TemplateSection() {
  return (
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

        </Grid>
      </Container>
  )
}
