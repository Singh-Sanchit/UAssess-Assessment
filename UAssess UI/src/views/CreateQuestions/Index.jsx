import React, { Component } from "react";
import { Row, Col, Grid } from "react-bootstrap";
import CreateQuestions from "./CreateQuestions";
import UnAuthorized from "../UnAuthorized/UnAuthorized";

export default class Index extends Component {
  render() {
    let role = JSON.parse(localStorage.getItem("user_role"));
    let found = 0;
    for (let i = 0; i < role.length; i++) {
      if (role[i] === "UassessAdmin" || role[i] === "Author") found = 1;
    }
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>{found ? <CreateQuestions /> : <UnAuthorized />}</Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
