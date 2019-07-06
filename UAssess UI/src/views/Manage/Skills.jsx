import React, { Component, Fragment } from "react";
import {
  Grid,
  Row,
  Col,
  FormControl,
  FormGroup,
  ControlLabel
} from "react-bootstrap";
import Card from "components/Card/Card";
import SubmitButton from "components/CustomButton/SubmitButton";
import TagsInput from "../../components/TagInput/TagsInput";
import * as SkillsApi from "../../api/SkillApi";

export default class Skills extends Component {
  state = {
    new_skills_label: [],
    new_skills_description: [],
    no_of_new_skills: "",
    skills_dropdown: [],
    competency_dropdown: [],
    tags: [],
    active_status: false,
    tempDesc: ""
  };

  addNewSkills = e => {
    e.preventDefault();
    let skill_label = [];
    for (let i = 0; i < this.state.new_skills_label.length; i++)
      if (
        this.state.new_skills_description[i].value !== "" &&
        this.state.new_skills_description[i].value
      )
        skill_label.push({
          label: this.state.new_skills_label[i].value,
          description: this.state.new_skills_description[i].value
        });
      else
        skill_label.push({
          label: this.state.new_skills_label[i].value
        });
    SkillsApi.CreateSkillApi({
      token: localStorage.getItem("token"),
      skills: skill_label
    }).then(res => {
      if (res.code === "0") {
        alert("Skills Added Successfully");
        let x = this.props.main_skill_list;
        res.data.forEach(data => x.push(data));
        this.props.updateSkillList(x);
        this.setState({
          new_skills_label: [],
          new_skills_description: [],
          skills_dropdown: x.map((result, key) => {
            return (
              <option value={result.id} key={result.id}>
                {result.label}
              </option>
            );
          })
        });
        this.changeNumberOfNewSkills({ target: { value: "" } });
      } else alert(res.message);
    });
  };

  editExistingSkills = e => {
    e.preventDefault();
    e.persist();
    let data = {};
    if (e.target.updateskill.value === "0") return;
    const competencyId = [];
    this.props.main_competency_list.forEach((res, key) => {
      if (this.state.tags.includes(res.label)) competencyId.push(res.id);
    });
    if (e.target.updateSkillName.value && e.target.updateSkillDescription.value)
      data = {
        token: localStorage.getItem("token"),
        skillId: e.target.updateskill.value,
        competencyIds: competencyId,
        label: e.target.updateSkillName.value,
        description: e.target.updateSkillDescription.value
      };
    else if (e.target.updateSkillName.value)
      data = {
        token: localStorage.getItem("token"),
        skillId: e.target.updateskill.value,
        competencyIds: competencyId,
        label: e.target.updateSkillName.value
      };
    else if (e.target.updateSkillDescription.value)
      data = {
        token: localStorage.getItem("token"),
        skillId: e.target.updateskill.value,
        competencyIds: competencyId,
        description: e.target.updateSkillDescription.value
      };
    else
      data = {
        token: localStorage.getItem("token"),
        skillId: e.target.updateskill.value,
        competencyIds: competencyId
      };
    SkillsApi.UpdateSkillApi(data).then(res => {
      if (res.code === "0") {
        alert(res.message);
        let x = this.props.main_skill_list;
        x.forEach((data, key) => {
          if (data.id === res.data.id) {
            data.label = res.data.label;
            data.competencyIds = res.data.competencyIds;
          }
        });
        this.props.updateSkillList(x);
        this.setState({
          skills_dropdown: x.map(result => {
            return (
              <option value={result.id} key={result.id}>
                {result.label}
              </option>
            );
          })
        });
        e.target.updateSkillName.value = "";
      } else alert(res.message);
    });
  };

  changeNumberOfNewSkills = e => {
    this.setState({ no_of_new_skills: e.target.value });
    const items = [];
    for (let i = 1; i <= e.target.value; i++) {
      items.push(
        <Row key={i}>
          <Col md={6}>
            <FormGroup controlId="formHorizontalEmail">
              <ControlLabel>Enter Names Of Skill to be Created:</ControlLabel>
              <FormControl
                type="text"
                placeholder="Enter Skill Name"
                bsClass="form-control question-dropdown"
                required
                key={i}
                inputRef={element =>
                  element ? this.state.new_skills_label.push(element) : ""
                }
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup controlId="formHorizontalEmail">
              <ControlLabel>Add Description to Your Skill:</ControlLabel>
              <FormControl
                type="text"
                placeholder="Enter Skill Description"
                bsClass="form-control question-dropdown"
                key={i}
                inputRef={element =>
                  element ? this.state.new_skills_description.push(element) : ""
                }
              />
            </FormGroup>
          </Col>
        </Row>
      );
    }
    this.setState({ new_skills: items });
  };

  changeActiveStatus = e => {
    if (e.target.value !== "0")
      this.setState({
        active_status: this.props.main_skill_list.filter(
          x => x.id === e.target.value
        )[0].active
      });
    else
      this.setState({
        active_status: false
      });
  };

  changeSkillStatus = e => {
    e.preventDefault();
    SkillsApi.UpdateSkillStatusApi({
      token: localStorage.getItem("token"),
      skillId: e.target.skillstatus.value,
      active: !this.state.active_status
    }).then(res => {
      if (res.code === "0") {
        let x = this.props.main_skill_list;
        x.forEach((data, key) => {
          if (data.id === res.data.id) data.active = res.data.active;
        });
        this.props.updateSkillList(x);
        this.setState({
          active_status: res.data.active
        });
      }
    });
  };

  populateTags = e => {
    const tags = [];
    let description = ""
    if (e.target.value !== "0")
      this.props.main_skill_list.forEach((result, key) => {
        if (result.id === e.target.value) {
          description = result.description;
          result.competencyIds.forEach((data, key) => {
            this.props.main_competency_list.forEach((res, key) => {
              if (data === res.id) tags.push(res.label);
            });
          });
        }
      });
    this.setState({ tempDesc: description, tags: tags });
  };

  updateTags = e => {
    if (e.target.value !== "0") {
      const competencyLabel = this.props.main_competency_list.filter(
        result => result.id === e.target.value
      )[0].label;
      if (!this.state.tags.includes(competencyLabel))
        this.setState({
          tags: [...this.state.tags, competencyLabel]
        });
    }
  };

  removeTags = e => {
    let index = this.state.tags.indexOf(e);
    this.setState({
      tags: this.state.tags.filter((_, i) => i !== index)
    });
  };

  componentWillReceiveProps(props) {
    if (props.main_skill_list && props.main_competency_list) {
      this.setState({
        skills_dropdown: props.main_skill_list.map(result => {
          return (
            <option value={result.id} key={result.id}>
              {result.label}
            </option>
          );
        })
      });
      this.setState({
        competency_dropdown: props.main_competency_list.map(result => {
          return (
            <option value={result.id} key={result.id}>
              {result.label}
            </option>
          );
        })
      });
    }
  }

  render() {
    return (
      <Fragment>
        <h5>Add New Skills</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.addNewSkills}>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <ControlLabel>
                            Enter Number of Skills to be Created:
                          </ControlLabel>
                          <FormControl
                            type="text"
                            placeholder="Number Of Skills"
                            bsClass="form-control question-dropdown"
                            required
                            value={this.state.no_of_new_skills}
                            onChange={this.changeNumberOfNewSkills}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {this.state.new_skills}
                    <Row>
                      <Col md={12} style={{ marginTop: "-20px" }}>
                        <SubmitButton buttonName="Add New Skills" />
                      </Col>
                    </Row>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Row>
          </Grid>
        </div>
        <h5>Update Existing Skills</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.editExistingSkills}>
                    <Row>
                      <Col md={3}>
                        <FormGroup>
                          <ControlLabel>Skill Name:</ControlLabel>
                          <FormControl
                            componentClass="select"
                            bsClass="form-control question-dropdown"
                            onChange={this.populateTags}
                            name="updateskill"
                          >
                            <option value="0">Select Type</option>
                            {this.state.skills_dropdown.map((data, key) => {
                              return data;
                            })}
                          </FormControl>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <ControlLabel>Update Name:</ControlLabel>
                          <FormControl
                            type="text"
                            placeholder="Enter New Name"
                            bsClass="form-control question-dropdown"
                            name="updateSkillName"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <ControlLabel>Update Description:</ControlLabel>
                          <FormControl
                            type="text"
                            value={this.state.tempDesc}
                            placeholder="Enter New Description"
                            bsClass="form-control question-dropdown"
                            name="updateSkillDescription"
                            onChange={e => this.setState({tempDesc: e.target.value})}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <ControlLabel>Add Competency:</ControlLabel>
                          <FormControl
                            componentClass="select"
                            bsClass="form-control question-dropdown"
                            name="addcompetency"
                            onChange={this.updateTags}
                          >
                            <option value="0">Select Type</option>
                            {this.state.competency_dropdown.map((data, key) => {
                              return data;
                            })}
                          </FormControl>
                        </FormGroup>
                      </Col>
                    </Row>
                    <TagsInput
                      value={this.state.tags}
                      removeTag={this.removeTags}
                      label="Existing Competency for Selected Skills:"
                    />
                    <Row>
                      <Col md={12}>
                        <SubmitButton buttonName="Update Skill" />
                      </Col>
                    </Row>
                  </form>
                }
              />
            </Row>
          </Grid>
        </div>
        <h5>Enable/Disable Existing Skills</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.changeSkillStatus}>
                    <Row>
                      <Col md={4}>
                        <FormGroup
                          validationState={
                            this.state.active_status ? "success" : "error"
                          }
                        >
                          <ControlLabel>Skill Name:</ControlLabel>
                          <FormControl
                            componentClass="select"
                            bsClass="form-control"
                            name="skillstatus"
                            onChange={this.changeActiveStatus}
                          >
                            <option value="0">Select Type</option>
                            {this.state.skills_dropdown.map((data, key) => {
                              return data;
                            })}
                          </FormControl>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <SubmitButton buttonName="Enable/Disable" />
                      </Col>
                    </Row>
                  </form>
                }
              />
            </Row>
          </Grid>
        </div>
      </Fragment>
    );
  }
}
