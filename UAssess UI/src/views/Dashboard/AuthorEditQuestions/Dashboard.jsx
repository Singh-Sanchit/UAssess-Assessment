import React, { Component, Fragment } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import Question from "./Question";
import SingleSelect from "./SingleSelect";
import MultiSelect from "./MultiSelect";
import { Card } from "components/Card/Card.jsx";
import Skills from "./Skills";
import BottomButtons from "./BottomButtons";
import * as QuestionApi from "api/QuestionApi";
import SweetAlert from "react-bootstrap-sweetalert";
var moment = require("moment");

class Dashboard extends Component {
  constructor(props) {
    super(props);
    let selectedKey = "0";
    let level = "";
    if (this.props.selected_question.skills.length > 0)
      level = this.props.selected_question.skills[0].level;
    else if (this.props.selected_question.competencies.length > 0) {
      level = this.props.selected_question.competencies[0].level;
    } else if (this.props.selected_question.subCompetencies.length > 0){
      level = this.props.selected_question.subCompetencies[0].level;
    }
    switch (this.props.selected_question.optionType) {
      case "radiogroup":
        selectedKey = "1";
        break;
      case "checkbox":
        selectedKey = "2";
        break;
      case "file":
        selectedKey = "4";
        break;
      case "text":
        selectedKey = "3";
        break;
      default:
        selectedKey = "0";
    }
    this.state = {
      alert: null,
      selectedQuestion: this.props.selected_question,
      selectedKey: selectedKey,
      currentlevel: level,
      optionCount: this.props.selected_question.options.length
    };
  }
  optionValue = [];
  checkBoxValue = [];

  changeKey = e => {
    this.setState({ selectedKey: e.target.value });
    this.setState({ optionCount: 3 });
  };

  cancelButton = e => {
    this.setState({ selectedKey: "0" });
  };

  changeOptionCount = e => {
    if (this.state.optionCount !== 1)
      this.setState({ optionCount: this.state.optionCount + e });
    if (this.state.optionCount === 1 && e === 1)
      this.setState({ optionCount: this.state.optionCount + 1 });
  };

  submitQuestion = e => {
    e.preventDefault();
    let option = [];
    let apioption = [];
    let apicompetencies = [];
    let apisubcompetencies = [];
    let questiontype = "radiogroup";
    if (e.target.expirydate.value !== "")
      if (!moment(e.target.expirydate.value, "YYYY-MM-DD", true).isValid())
        return;
    switch (e.target.typeOfQuestion.value) {
      case "1":
        questiontype = "radiogroup";
        for (var i = 0; i < this.state.optionCount; i++)
          if (this.optionValue[i].value) {
            option.push(this.optionValue[i].value);
            if (e.target.answerType.value === "notApplicable") {
              apioption.push({
                label: this.optionValue[i].value,
                id: `${i + 1}`,
                value: `${i + 1}`,
                answer: e.target.radiogroup.value === `${i + 1}` ? true : false
              });
            } else {
              apioption.push({
                label: this.optionValue[i].value,
                id: `${i + 1}`,
                answer: e.target.radiogroup.value === `${i + 1}` ? true : false
              });
            }
          }
        break;
      case "2":
        questiontype = "checkbox";
        for (i = 0; i < this.state.optionCount; i++)
          if (this.optionValue[i].value) {
            option.push(this.optionValue[i].value);
            let index = this.checkBoxValue.findIndex(
              // eslint-disable-next-line
              x => x.name === `${i + 1}`
            );
            if (e.target.answerType.value === "notApplicable") {
              apioption.push({
                label: this.optionValue[i].value,
                id: `${i + 1}`,
                value: i + 1,
                answer: this.checkBoxValue[index]
                  ? this.checkBoxValue[index].value
                  : false
              });
            } else
              apioption.push({
                label: this.optionValue[i].value,
                id: `${i + 1}`,
                answer: this.checkBoxValue[index]
                  ? this.checkBoxValue[index].value
                  : false
              });
          }
        break;
      case "3":
        questiontype = "text";
        break;
      case "4":
        questiontype = "file";
        break;
      default:
    }
    if (this.props.selected_question.competencies.length > 0) {
      apicompetencies.push({
        id:
          e.target.competency.value !== "0"
            ? e.target.competency.value
            : this.props.selected_question.competencies[0].id,
        level: e.target.level.value
      });
      apisubcompetencies = "";
    } else {
      apisubcompetencies.push({
        id:
          e.target.subcompetency.value !== "0"
            ? e.target.subcompetency.value
            : this.props.selected_question.subCompetencies[0].id,
        level: e.target.level.value
      });
      apicompetencies = "";
    }
    QuestionApi.UpdateQuestionApi({
      token: localStorage.getItem("token"),
      title: e.target.questionName.value,
      questionId: this.props.selected_question.id,
      titleMedia: "",
      optionType: questiontype,
      answerType: e.target.answerType.value,
      skills: [],
      competencies: apicompetencies,
      subCompetencies: apisubcompetencies,
      options: apioption,
      state: "approved",
      expiresAt: e.target.expirydate.value,
      weightage: 1
    }).then(res => {
      if (res.code === "0")
        this.setState({
          alert: (
            <SweetAlert
              success
              title="Question Updated Successfully"
              onConfirm={() => {
                this.setState({ alert: null });
                this.props.onHide();
              }}
            />
          )
        });
    });
  };

  renderSwitch = key => {
    const items = [];
    this.optionValue.length = 0;
    switch (key) {
      case "1":
        for (let i = 1; i <= this.state.optionCount; i++) {
          if (i <= this.props.selected_question.options.length)
            items.push(
              <SingleSelect
                key={i}
                name={i}
                optionId={this.props.selected_question.options[i - 1].id}
                optionLabel={this.props.selected_question.options[i - 1].label}
                optionRightStatus={
                  this.props.selected_question.options[i - 1].answer
                }
                optionValue={this.optionValue}
                selectValue={i}
                changeOptionCount={this.changeOptionCount}
              />
            );
          else
            items.push(
              <SingleSelect
                key={i}
                name={i}
                optionValue={this.optionValue}
                selectValue={i}
                changeOptionCount={this.changeOptionCount}
              />
            );
        }
        return items;
      case "2":
        for (let i = 1; i <= this.state.optionCount; i++)
          if (i <= this.props.selected_question.options.length)
            items.push(
              <MultiSelect
                key={i}
                name={i}
                optionId={this.props.selected_question.options[i - 1].id}
                optionLabel={this.props.selected_question.options[i - 1].label}
                optionRightStatus={
                  this.props.selected_question.options[i - 1].answer
                }
                selectValue={i}
                checkBoxValue={this.checkBoxValue}
                optionValue={this.optionValue}
                changeOptionCount={this.changeOptionCount}
              />
            );
          else
            items.push(
              <MultiSelect
                key={i}
                name={i}
                selectValue={i}
                checkBoxValue={this.checkBoxValue}
                optionValue={this.optionValue}
                changeOptionCount={this.changeOptionCount}
              />
            );
        return items;
      default:
        return;
    }
  };

  render() {
    return (
      <Fragment>
        <div className="content">
          <Grid fluid>
            <Row>
              <Col md={12}>
                <Card
                  content={
                    <form
                      className="question-form"
                      onSubmit={this.submitQuestion}
                    >
                      <Row className="grey-background">
                        <Question
                          changeKey={this.changeKey}
                          selectedKey={this.state.selectedKey}
                          questionTitle={this.props.selected_question.title}
                        />
                      </Row>
                      {this.state.selectedKey !== "0" ? (
                        <Fragment>
                          <Row
                            className="grey-background"
                            style={{ paddingLeft: "15px" }}
                          >
                            <Skills
                              level={this.state.currentlevel}
                              answerType={
                                this.props.selected_question.answerType
                              }
                              expiryDate={
                                this.props.selected_question.expiresAt
                              }
                            />
                            {this.renderSwitch(this.state.selectedKey)}
                          </Row>
                        </Fragment>
                      ) : (
                        ""
                      )}
                      <BottomButtons />
                    </form>
                  }
                />
              </Col>
            </Row>
          </Grid>
        </div>
        {this.state.alert}
      </Fragment>
    );
  }
}

export default Dashboard;
