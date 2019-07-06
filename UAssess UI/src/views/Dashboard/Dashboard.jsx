import React, { Component, Fragment } from "react";
import { Grid, Row, Col, FormControl } from "react-bootstrap";
import { Card } from "../../components/Card/Card";
import ShowAllQuestion from "./ShowAllQuestion";
import Skeleton from "react-loading-skeleton";
import SkillSelection from "./SkillSelection";
import * as QuestionApi from "../../api/QuestionApi";

export default class Dashboard extends Component {
  state = {
    isLoading: true,
    question: [],
    lgShow: JSON.parse(localStorage.getItem("SelectSkill")),
    filterParameter: ""
  };

  lgClose = tags => {
    this.setState({ lgShow: false });
    localStorage.setItem("SelectSkill", false);
    localStorage.setItem("SelectedSkills", JSON.stringify(tags));
  };

  updateQuestion = x => {
    this.setState(() => {
      return {
        question: x
      };
    });
  };

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem("user_role")).includes("UassessAdmin"))
      this.setState(prevState => {
        return { lgShow: JSON.parse(localStorage.getItem("SelectSkill")) };
      });
    QuestionApi.GetAllQuestionsApi({
      token: localStorage.getItem("token"),
      active: true
    }).then(res => {
      if (
        JSON.parse(localStorage.getItem("user_role")).includes("UassessAdmin")
      )
        this.setState({
          question: res.data,
          isLoading: false
        });
      else if (
        JSON.parse(localStorage.getItem("user_role")).includes("Evaluator")
      ) {
        let x = res.data.filter(result => result.state === "draft");
        this.setState({
          question: x,
          isLoading: false
        });
      } else
        this.setState({
          question: res.data.filter(
            result => result.createdBy === localStorage.getItem("user_id")
          ),
          isLoading: false
        });
    });
  }

  render() {
    let filteredQuestion = this.state.question.filter(result => {
      return (
        result.title
          .toLowerCase()
          .indexOf(this.state.filterParameter.toLowerCase()) !== -1
      );
    });
    return (
      <Fragment>
        <div className="content">
          <Grid fluid>
            <Row>
              <Col md={4} style={{ marginBottom: "10px" }}>
                <FormControl
                  type="text"
                  placeholder="Filter Question"
                  bsClass="form-control question-dropdown"
                  value={this.state.filterParameter}
                  onChange={e =>
                    this.setState({
                      filterParameter: e.target.value
                    })
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Card
                  skills="true"
                  noPadding
                  content={
                    <Fragment>
                      {this.state.isLoading ? (
                        <Fragment>
                          <Skeleton count={5} />
                          <h3>
                            <Skeleton />
                          </h3>
                          <h3>
                            <Skeleton />
                          </h3>
                          <h3>
                            <Skeleton />
                          </h3>
                          <h3>
                            <Skeleton />
                          </h3>
                        </Fragment>
                      ) : (
                        <ShowAllQuestion
                          questions={filteredQuestion}
                          updateQuestion={this.updateQuestion}
                        />
                      )}
                    </Fragment>
                  }
                />
              </Col>
            </Row>
          </Grid>
        </div>
        <SkillSelection show={this.state.lgShow} onHide={this.lgClose} />
      </Fragment>
    );
  }
}
