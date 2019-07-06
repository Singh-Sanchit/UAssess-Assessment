import React, { Component } from "react";
import Button from "../../components/CustomButton/CustomButton.jsx";
import { Row } from "react-bootstrap";

export default class BottomButtons extends Component {
  render() {
    return (
      <Row style={{ padding: "15px" }} >
        <Button bsStyle="info" fill type="submit">
          Next Question
        </Button>
        <Button pullRight fill onClick={this.props.cancelButton}>
          Cancel
        </Button>
        <Button
          bsStyle="info"
          pullRight
          fill
          type="submit"
          style={{ marginRight: "15px" }}
        >
          Save
        </Button>
      </Row>
    );
  }
}
