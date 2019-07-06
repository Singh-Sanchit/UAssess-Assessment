import React, { Component } from "react";
import Button from "components/CustomButton/CustomButton";

export default class SubmitButton extends Component {
  render() {
    return (
      <Button
        bsStyle="info"
        fill
        block
        type="submit"
        style={{
          fontSize: "15px",
          marginTop: "20px"
        }}
      >
        <i className="fa fa-paper-plane fa-lg" />
        &nbsp;&nbsp;&nbsp; {this.props.buttonName}
      </Button>
    );
  }
}
