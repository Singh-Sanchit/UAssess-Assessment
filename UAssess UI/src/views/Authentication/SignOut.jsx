import React, { Component } from "react";

export default class SignOut extends Component {
  componentDidMount() {
    localStorage.clear();
    this.props.history.push("/abc");
  }
  render() {
    return <div />;
  }
}
