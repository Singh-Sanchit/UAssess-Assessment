import React, { Component } from "react";
import { Grid } from "react-bootstrap";

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Grid fluid>
          <p className="copyright pull-left">
            <strong>UAssess &copy; {new Date().getFullYear()},</strong>All
            rights reserved.
          </p>
        </Grid>
      </footer>
    );
  }
}
