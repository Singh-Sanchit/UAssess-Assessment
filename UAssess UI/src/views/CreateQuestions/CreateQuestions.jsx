import React, { Component, Fragment } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import Question from "./Question";
import SingleSelect from "./SingleSelect";
import MultiSelect from "./MultiSelect";
import BottomButtons from "./BottomButtons";
import { Card } from "../../components/Card/Card.jsx";
import Skills from "./Skills";
import SweetAlert from "react-bootstrap-sweetalert";
import * as QuestionApi from "../../api/QuestionApi";
import * as Survey from "survey-react";
var moment = require("moment");

class Dashboard extends Component {
  optionValue = [];
  checkBoxValue = [];
  state = {
    alert: null,
    selectedKey: "0",
    questionCount: 1,
    optionCount: 3,
    surveyjsjson: {
      pages: [
        {
          elements: []
        }
      ]
    }
  };

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
    if (!moment(e.target.expirydate.value, "YYYY-MM-DD", true).isValid()) {
      this.setState({
        alert: (
          <SweetAlert
            danger
            title="Please Enter Proper Expiry Date"
            onConfirm={() => {
              this.setState({ alert: null });
            }}
          />
        )
      });
      return;
    }
    if (e.target.skill.value === "0" || e.target.competency.value === "0") {
      this.setState({
        alert: (
          <SweetAlert
            danger
            title="Please Select Proper Skills and Competency"
            onConfirm={() => {
              this.setState({ alert: null });
            }}
          />
        )
      });
      return;
    }
    if (e.target.level.value === "0") {
      this.setState({
        alert: (
          <SweetAlert
            danger
            title="Please Select A Level"
            onConfirm={() => {
              this.setState({ alert: null });
            }}
          />
        )
      });
      return;
    }
    if (e.target.answerType.value === "0") {
      this.setState({
        alert: (
          <SweetAlert
            danger
            title="Please Select An Answer-Type"
            onConfirm={() => {
              this.setState({ alert: null });
            }}
          />
        )
      });
      return;
    }
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
    const question = {
      type: questiontype,
      name: e.target.questionName.value,
      choices: option
    };
    if (e.target.subcompetency.value === "0") {
      apicompetencies.push({
        id: e.target.competency.value,
        level: e.target.level.value
      });
      apisubcompetencies = "";
    } else {
      apisubcompetencies.push({
        id: e.target.subcompetency.value,
        level: e.target.level.value
      });
      apicompetencies = "";
    }
    let list = this.state.surveyjsjson;
    list.pages[0].elements.push(question);
    QuestionApi.CreateQuestionApi({
      token: localStorage.getItem("token"),
      title: e.target.questionName.value,
      titleMedia: "",
      optionType: questiontype,
      answerType: e.target.answerType.value,
      skills: [],
      competencies: apicompetencies,
      subCompetencies: apisubcompetencies,
      options: apioption,
      state: JSON.parse(localStorage.getItem("AdminStatus")) ? "approved": "draft",
      expiresAt: e.target.expirydate.value,
      weightage: 1
    }).then(res => {});
    this.checkBoxValue.length = 0;
    this.setState({
      selectedKey: "0",
      questionCount: this.state.questionCount + 1,
      surveyjsjson: list
    });
  };

  renderSwitch = key => {
    const items = [];
    this.optionValue.length = 0;
    switch (key) {
      case "1":
        for (let i = 1; i <= this.state.optionCount; i++)
          items.push(
            <SingleSelect
              key={i}
              name={i}
              optionValue={this.optionValue}
              selectValue={i}
              changeOptionCount={this.changeOptionCount}
            />
          );
        return items;
      case "2":
        for (let i = 1; i <= this.state.optionCount; i++)
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
    Survey.Survey.cssType = "bootstrap";
    var model = new Survey.Model(this.state.surveyjsjson);
    model.mode = "display";
    return (
      <Fragment>
        <div className="content">
          <Grid fluid>
            <Row>
              <Col md={12}>
                <Card
                  header="true"
                  content={
                    <div style={{ padding: "5px 0px 5px 0px" }}>
                      {this.state.surveyjsjson.pages[0].elements.length > 0 ? (
                        <div className="surveyjs">
                          <Survey.Survey model={model} />
                        </div>
                      ) : (
                        ""
                      )}
                      <Card
                        question="true"
                        content={
                          <form
                            className="question-form"
                            onSubmit={this.submitQuestion}
                          >
                            <Row className="grey-background">
                              <Question
                                changeKey={this.changeKey}
                                questionNo={this.state.questionCount}
                                selectedKey={this.state.selectedKey}
                              />
                            </Row>
                            {this.state.selectedKey !== "0" ? (
                              <Fragment>
                                <Row
                                  className="grey-background"
                                  style={{ paddingLeft: "15px" }}
                                >
                                  <Skills />
                                  {this.renderSwitch(this.state.selectedKey)}
                                </Row>
                                <BottomButtons
                                  cancelButton={this.cancelButton}
                                />
                              </Fragment>
                            ) : (
                              ""
                            )}
                          </form>
                        }
                      />
                    </div>
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
