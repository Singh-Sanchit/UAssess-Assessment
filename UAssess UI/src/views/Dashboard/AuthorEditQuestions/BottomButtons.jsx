import React, { Component } from "react";
import Button from "components/CustomButton/CustomButton.jsx";
import { Row } from "react-bootstrap";

export default class BottomButtons extends Component {
  render() {
    return (
      <Row style={{ padding: "15px" }} >
        <Button
          bsStyle="info"
          pullRight
          fill
          type="submit"
          style={{ marginRight: "15px" }}
        >
          Update
        </Button>
      </Row>
    );
  }
}
