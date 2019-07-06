import React, { Component } from "react";
import { Row, Col, Grid } from "react-bootstrap";
import AuthorEditQuestion from "./AuthorEditQuestion";
import UnAuthorized from "../../UnAuthorized/UnAuthorized";

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
                <AuthorEditQuestion
                  show={this.props.show}
                  onHide={this.props.onHide}
                  selected_question={this.props.selected_question}
                />
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
