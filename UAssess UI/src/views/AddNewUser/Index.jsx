import React, { Component } from "react";
import AddNewUser from "./AddNewUser";
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
              ) ? (
                <AddNewUser />
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
