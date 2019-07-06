import React, { Component } from "react";

export default class UnAuthorized extends Component {
  render() {
    return (
      <div id="errorWrapper">
        <div id="error403" />
        <p id="errorText">
          <span className="red">error 403</span>
          <br /> access denied
        </p>
      </div>
    );
  }
}
