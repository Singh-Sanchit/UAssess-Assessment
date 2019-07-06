import React, { Component } from "react";
import { Row, Col, Grid, FormControl, ControlLabel } from "react-bootstrap";
import * as SkillsApi from "api/SkillApi";
import * as CompetencyApi from "api/CompetencyApi";
import * as SubCompetencyApi from "api/SubCompetencyApi";
import * as LevelApi from "api/LevelApi";

export default class Skills extends Component {
  state = {
    skills_dropdown: [],
    competencies_dropdown: [],
    subCompetencies_dropdown: [],
    level_dropdown: [],
    currentExpiryDate: "",
    currentAnswerType: "",
    currentLevel: ""
  };

  getCompetencies = e => {
    let competencies = [];
    for (let i = 0; i < this.state.skills_dropdown.length; i++) {
      if (this.state.skills_dropdown[i].skillId === e.target.value) {
        competencies = this.state.skills_dropdown[i].competencyIds;
        break;
      }
    }
    if (competencies.length > 0)
      CompetencyApi.GetCompetenciesApi({
        token: localStorage.getItem("token"),
        active: true,
        ids: competencies
      }).then(res => {
        if (res.code === "0")
          this.setState({
            competencies_dropdown: res.data.map((result, key) => {
              return {
                subCompetencyIds: result.subCompetencyIds,
                competencyId: result.id,
                select: (
                  <option value={result.id} key={result.id}>
                    {result.label}
                  </option>
                )
              };
            })
          });
      });
  };

  getSubCompetencies = e => {
    let subcompetencies = [];
    for (let i = 0; i < this.state.competencies_dropdown.length; i++) {
      if (this.state.competencies_dropdown[i].competencyId === e.target.value) {
        subcompetencies = this.state.competencies_dropdown[i].subCompetencyIds;
        break;
      }
    }
    if (subcompetencies.length > 0)
      SubCompetencyApi.GetSubCompetenciesApi({
        token: localStorage.getItem("token"),
        active: true,
        ids: subcompetencies
      }).then(res => {
        if (res.code === "0")
          this.setState({
            subCompetencies_dropdown: res.data.map((result, key) => {
              return {
                subCompetencyId: result.id,
                select: (
                  <option value={result.id} key={result.id}>
                    {result.label}
                  </option>
                )
              };
            })
          });
      });
  };

  componentDidMount() {
    this.setState({
      currentExpiryDate: this.props.expiryDate,
      currentAnswerType: this.props.answerType,
      currentLevel: this.props.level
    });
    SkillsApi.GetSkillsApi().then(res => {
      if (res.code === "0")
        this.setState({
          skills_dropdown: res.data.map((result, key) => {
            return {
              competencyIds: result.competencyIds,
              skillId: result.id,
              select: (
                <option value={result.id} key={result.id}>
                  {result.label}
                </option>
              )
            };
          })
        });
    });
    LevelApi.GetLevelApi().then(res => {
      if (res.code === "0")
        this.setState({
          level_dropdown: res.data.map(result => {
            return (
              <option value={result.id} key={result.id}>
                {result.label}
              </option>
            );
          })
        });
    });
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col md={4} style={{ paddingLeft: "0px" }}>
            <ControlLabel>Select Skills</ControlLabel>
            <FormControl
              componentClass="select"
              bsClass="form-control question-dropdown"
              name="skill"
              onChange={this.getCompetencies}
            >
              <option value="0">Select Type</option>
              {this.state.skills_dropdown.map((data, key) => {
                return data.select;
              })}
            </FormControl>
          </Col>
          <Col md={4} style={{ paddingLeft: "0px" }}>
            <ControlLabel>Select Competencies</ControlLabel>
            <FormControl
              componentClass="select"
              bsClass="form-control question-dropdown"
              name="competency"
              onChange={this.getSubCompetencies}
            >
              <option value="0">Select Type</option>
              {this.state.competencies_dropdown.map((data, key) => {
                return data.select;
              })}
            </FormControl>
          </Col>
          <Col md={4} style={{ paddingLeft: "0px" }}>
            <ControlLabel>Select Sub-Competencies</ControlLabel>
            <FormControl
              componentClass="select"
              bsClass="form-control question-dropdown"
              name="subcompetency"
            >
              <option value="0">Select Type</option>
              {this.state.subCompetencies_dropdown.map((data, key) => {
                return data.select;
              })}
            </FormControl>
          </Col>
        </Row>
        <Row>
          <Col md={4} style={{ paddingLeft: "0px" }}>
            <ControlLabel>Select Level</ControlLabel>
            <FormControl
              componentClass="select"
              bsClass="form-control question-dropdown"
              name="level"
              value={this.state.currentLevel}
              onChange={e => this.setState({ currentLevel: e.target.value })}
            >
              <option value="0">Select Type</option>
              {this.state.level_dropdown}
            </FormControl>
          </Col>
          <Col md={4} style={{ paddingLeft: "0px" }}>
            <ControlLabel>Select Answer Type</ControlLabel>
            <FormControl
              componentClass="select"
              bsClass="form-control question-dropdown"
              name="answerType"
              value={this.state.currentAnswerType}
              onChange={e =>
                this.setState({ currentAnswerType: e.target.value })
              }
            >
              <option value="0">Select Type</option>
              <option value="correctAnswer">Correct Answer</option>
              <option value="notApplicable">Not Applicable</option>
            </FormControl>
          </Col>
          <Col md={4} style={{ paddingLeft: "0px" }}>
            <ControlLabel>Expiry Date</ControlLabel>
            <FormControl
              type="text"
              placeholder="YYYY-MM-DD"
              bsClass="form-control question-dropdown"
              name="expirydate"
              value={this.state.currentExpiryDate}
              onChange={e =>
                this.setState({ currentExpiryDate: e.target.value })
              }
              required
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}
