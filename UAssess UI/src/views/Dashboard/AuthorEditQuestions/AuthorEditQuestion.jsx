import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import QuestionDashboard from "./Dashboard";
export default class AuthorEditQuestion extends Component {
  render() {
    return (
      <Modal
        {...this.props}
        bsSize="large"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">
            Edit Single Question
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QuestionDashboard
            selected_question={this.props.selected_question}
            onHide={this.props.onHide}
          />
        </Modal.Body>
      </Modal>
    );
  }
}
