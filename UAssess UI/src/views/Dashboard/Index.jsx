import React, { Component } from "react";
import Dashboard from "./Dashboard";
import { Row, Col, Grid } from "react-bootstrap";
import UnAuthorized from "../UnAuthorized/UnAuthorized";

export default class Index extends Component {
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              {JSON.parse(localStorage.getItem("user_role")).includes(
                "UassessAdmin"
              ) ||
              JSON.parse(localStorage.getItem("user_role")).includes(
                "Author"
              ) ? (
                <Dashboard />
              ) : (
                <UnAuthorized />
              )}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
