import React, { Component, Fragment } from "react";
import { Modal, Grid, Row, Col, FormControl, FormGroup } from "react-bootstrap";
import CustomButton from "components/CustomButton/CustomButton";
import * as QuestionApi from "../../../api/QuestionApi";
import SweetAlert from "react-bootstrap-sweetalert";

export default class EvaluatorEditQuestions extends Component {
  state = {
    questionState: "",
    optionType: "",
    questionId: "",
    checkboxOn: "",
    alert: null
  };
  componentDidMount() {
    if (this.props.selected_question.state !== "temp") {
      this.setState({
        questionState: this.props.selected_question.state,
        optionType: this.props.selected_question.optionType,
        questionId: this.props.selected_question.id,
        checkboxOn: this.props.selected_question.state === "approved"
      });
    }
  }

  changeCheckboxStatus = () => {
    this.setState({ checkboxOn: !this.state.checkboxOn });
  };

  changeQuestionStatus = e => {
    e.preventDefault();
    let state = "draft";
    if (this.state.checkboxOn) state = "approved";
    QuestionApi.UpdateQuestionApi({
      token: localStorage.getItem("token"),
      questionId: this.state.questionId,
      state: state,
      optionType: this.state.optionType,
      comments: e.target.reviews.value
    }).then(res => {
      if (res.code === "0") {
        this.setState({
          alert: (
            <SweetAlert
              success
              title="Question Updated Successfully"
              onConfirm={() => {
                this.setState({ alert: null });
                this.props.onHide()
              }}
            />
          )
        });
      }
    });
  };
  render() {
    return (
      <Fragment>
        <Modal
          {...this.props}
          bsSize="large"
          aria-labelledby="contained-modal-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">
              Evaluate Question
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="content">
              <Grid fluid>
                <Row>
                  <Col md={12}>
                    <form
                      onSubmit={this.changeQuestionStatus}
                      style={{ padding: "20px" }}
                    >
                      <h5>Approved Status:</h5>
                      <label className="editquestionswitch">
                        <input
                          type="checkbox"
                          checked={this.state.checkboxOn}
                          onChange={this.changeCheckboxStatus}
                          name="questionStatus"
                        />
                        <span className="editquestionslider round" />
                      </label>
                      <h5>Comments:</h5>
                      <FormGroup controlId="formControlsTextarea">
                        <FormControl
                          componentClass="textarea"
                          name="reviews"
                          placeholder="Add Your Reviews"
                        />
                      </FormGroup>
                      <CustomButton bsStyle="info" fill type="submit">
                        Submit
                      </CustomButton>
                    </form>
                  </Col>
                </Row>
              </Grid>
            </div>
          </Modal.Body>
        </Modal>
        {this.state.alert}
      </Fragment>
    );
  }
}
