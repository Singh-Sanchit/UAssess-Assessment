import React, { Component, Fragment } from "react";
import { Table } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import AuthorEditQuestion from "./AuthorEditQuestions/AuthorEditQuestion";
import EvaluatorEditQuestions from "./EvaluatorEditQuestions/Index";
import moment from "moment";
import * as QuestionApi from "../../api/QuestionApi";

export default class ShowAllQuestion extends Component {
  state = {
    alert: null,
    lgShow: false,
    evalLgShow: false,
    selectedQuestion: [{ state: "temp" }]
  };

  editAuthorQuestion = e => {
    const selectedQuestion = this.props.questions.filter(
      data => data.id === e.target.id
    );
    this.setState({ lgShow: true, selectedQuestion: selectedQuestion });
  };

  editEvaluatorQuestion = e => {
    const selectedQuestion = this.props.questions.filter(
      data => data.id === e.target.id
    );
    this.setState({ evalLgShow: true, selectedQuestion: selectedQuestion });
  };

  deleteQuestion = e => {
    e.persist();
    this.setState({
      alert: (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={() => {
            QuestionApi.UpdateQuestionStatusApi({
              token: localStorage.getItem("token"),
              questionId: e.target.id,
              active: false
            }).then(res => {
              if (res.code === "0") {
                this.setState({
                  alert: (
                    <SweetAlert
                      success
                      title="Question Deleted Successfully!"
                      onConfirm={() => {
                        this.setState({ alert: null });
                      }}
                    />
                  )
                });
                let x = this.props.questions.filter(
                  data => data.id !== e.target.id
                );
                this.props.updateQuestion(x);
              }
            });
          }}
          onCancel={() => {
            this.setState({ alert: null });
          }}
        >
          You will not be able to recover this questions
        </SweetAlert>
      )
    });
  };

  render() {
    let lgClose = () => this.setState({ lgShow: false });
    let evalLgClose = () => {
      this.setState({
        evalLgShow: false
      });
    };
    if (JSON.parse(localStorage.getItem("AdminStatus")))
      return (
        <Fragment>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Title</th>
                <th>Answer Type</th>
                <th>Option Type</th>
                <th>Created At</th>
                <th>Expires At</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.props.questions.map((data, key) => {
                return (
                  <tr key={key}>
                    <td>
                      <i
                        className="fa fa-circle"
                        aria-hidden="true"
                        style={{
                          color:
                            data.state === "approved" ? "#4CAF50" : "#FF9800"
                        }}
                      />
                      {key + 1}
                    </td>
                    <td>{data.title}</td>
                    <td>{data.answerType}</td>
                    <td>{data.optionType}</td>
                    <td>{moment(data.createdAt).format("DD-MM-YYYY")}</td>
                    <td>{moment(data.expiresAt).format("DD-MM-YYYY")}</td>
                    <td
                      style={{
                        maxWidth: "100%",
                        whiteSpace: "nowrap"
                      }}
                    >
                      <i
                        className="fa fa-edit fa-2x table-icon"
                        id={data.id}
                        onClick={this.editAuthorQuestion}
                      />
                      <i
                        className="fa fa-gears fa-2x table-icon"
                        id={data.id}
                        onClick={this.editEvaluatorQuestion}
                      />
                      <i
                        className="fa fa-trash fa-2x table-icon"
                        id={data.id}
                        onClick={this.deleteQuestion}
                        style={{ marginTop: "-10px" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {this.state.lgShow && (
            <AuthorEditQuestion
              show={this.state.lgShow}
              onHide={lgClose}
              selected_question={this.state.selectedQuestion[0]}
            />
          )}
          {this.state.evalLgShow && (
            <EvaluatorEditQuestions
              show={this.state.evalLgShow}
              onHide={evalLgClose}
              selected_question={this.state.selectedQuestion[0]}
            />
          )}
          {this.state.alert}
        </Fragment>
      );
    else if (JSON.parse(localStorage.getItem("SelectedSkills")))
      return (
        <Fragment>
          {JSON.parse(localStorage.getItem("SelectedSkills")).length ? (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Title</th>
                  <th>Answer Type</th>
                  <th>Option Type</th>
                  <th>Created At</th>
                  <th>Expires At</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.props.questions.map((data, key) => {
                  return (
                    <tr key={key}>
                      <td>
                        <i
                          className="fa fa-circle"
                          aria-hidden="true"
                          style={{
                            color:
                              data.state === "approved" ? "#4CAF50" : "#FF9800"
                          }}
                        />
                        {key + 1}
                      </td>
                      <td>{data.title}</td>
                      <td>{data.answerType}</td>
                      <td>{data.optionType}</td>
                      <td>{moment(data.createdAt).format("DD-MM-YYYY")}</td>
                      <td>{moment(data.expiresAt).format("DD-MM-YYYY")}</td>
                      <td
                        style={{
                          maxWidth: "100%",
                          whiteSpace: "nowrap"
                        }}
                      >
                        <i
                          className="fa fa-edit fa-2x table-icon"
                          id={data.id}
                          onClick={this.editAuthorQuestion}
                        />
                        <i
                          className="fa fa-edit fa-2x table-icon"
                          id={data.id}
                          onClick={this.editEvaluatorQuestion}
                        />
                        <i
                          className="fa fa-trash fa-2x table-icon"
                          id={data.id}
                          onClick={this.deleteQuestion}
                          style={{ marginTop: "-10px" }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <h2>Please select the skills in which you want to contribute</h2>
          )}
          {this.state.lgShow && (
            <AuthorEditQuestion
              show={this.state.lgShow}
              onHide={lgClose}
              selected_question={this.state.selectedQuestion[0]}
            />
          )}
          {this.state.alert}
        </Fragment>
      );
    else return null;
  }
}
