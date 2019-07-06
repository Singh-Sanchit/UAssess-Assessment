import React, { Component } from "react";
import { Row, Grid, Col, FormControl, FormGroup } from "react-bootstrap";

export default class Question extends Component {
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={1}>
              <p>Q{this.props.questionNo}.</p>
            </Col>
            <FormGroup>
              <Col md={8} style={{ paddingRight: "0px" }}>
                <FormControl
                  type="text"
                  bsClass="form-control question-dropdown"
                  placeholder="Enter your question"
                  name="questionName"
                  required
                />
              </Col>
              <Col md={3} style={{ paddingLeft: "0px" }}>
                <FormControl
                  componentClass="select"
                  bsClass="form-control question-dropdown"
                  name="typeOfQuestion"
                  onChange={this.props.changeKey}
                  value={this.props.selectedKey}
                >
                  <option value="0">Select Type</option>
                  <option value="1">Single Select</option>
                  <option value="2">Multi Select</option>
                  <option value="3">Text Area</option>
                  <option value="4">Video Question</option>
                </FormControl>
              </Col>
            </FormGroup>
          </Row>
        </Grid>
      </div>
    );
  }
}
