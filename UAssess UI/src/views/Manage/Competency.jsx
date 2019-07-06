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
import * as CompetencyApi from "../../api/CompetencyApi";
import * as SubCompetencyApi from "../../api/SubCompetencyApi";

export default class Competency extends Component {
  state = {
    main_subcompetency_list: "",
    new_competencies_label: [],
    new_competencies_description: [],
    no_of_new_competency: "",
    competency_dropdown: [],
    subcompetency_dropdown: [],
    tags: [],
    active_status: false,
    tempDesc: ""
  };

  addNewCompetency = e => {
    e.preventDefault();
    let competencies_label = [];
    for (let i = 0; i < this.state.new_competencies_label.length; i++)
      if (
        this.state.new_competencies_description[i].value !== "" &&
        this.state.new_competencies_description[i].value
      )
        competencies_label.push({
          label: this.state.new_competencies_label[i].value,
          description: this.state.new_competencies_description[i].value
        });
      else
        competencies_label.push({
          label: this.state.new_competencies_label[i].value
        });
    CompetencyApi.CreateCompetencyApi({
      token: localStorage.getItem("token"),
      competencies: competencies_label
    }).then(res => {
      if (res.code === "0") {
        alert(res.message);
        let x = this.props.main_competency_list;
        res.data.forEach(data => x.push(data));
        this.props.updateCompetencyList(x);
        this.setState({
          new_competencies_label: [],
          new_competencies_description: [],
          competency_dropdown: x.map((result, key) => {
            return (
              <option value={result.id} key={result.id}>
                {result.label}
              </option>
            );
          })
        });
        this.changeNumberOfNewCompetency({ target: { value: "" } });
      } else alert(res.message);
    });
  };

  editExistingCompetency = e => {
    e.preventDefault();
    e.persist();
    if (e.target.updatecompetency.value === "0") return;
    let data = {};
    const subCompetencyId = [];
    this.props.main_subcompetency_list.forEach((res, key) => {
      if (this.state.tags.includes(res.label)) subCompetencyId.push(res.id);
    });
    if (
      e.target.updateCompetencyName.value &&
      e.target.updateCompetencyDescription.value
    )
      data = {
        token: localStorage.getItem("token"),
        competencyId: e.target.updatecompetency.value,
        subCompetencyIds: subCompetencyId,
        label: e.target.updateCompetencyName.value,
        description: e.target.updateCompetencyDescription.value
      };
    else if (e.target.updateCompetencyName.value)
      data = {
        token: localStorage.getItem("token"),
        competencyId: e.target.updatecompetency.value,
        subCompetencyIds: subCompetencyId,
        label: e.target.updateCompetencyName.value
      };
    else if (e.target.updateCompetencyDescription.value)
      data = {
        token: localStorage.getItem("token"),
        competencyId: e.target.updatecompetency.value,
        subCompetencyIds: subCompetencyId,
        description: e.target.updateCompetencyDescription.value
      };
    else
      data = {
        token: localStorage.getItem("token"),
        competencyId: e.target.updatecompetency.value,
        subCompetencyIds: subCompetencyId
      };
    CompetencyApi.UpdateCompetencyApi(data).then(res => {
      if (res.code === "0") {
        alert(res.message);
        let x = this.props.main_competency_list;
        x.forEach((data, key) => {
          if (data.id === res.data.id) {
            data.label = res.data.label;
            data.subCompetencyIds = res.data.subCompetencyIds;
          }
        });
        this.props.updateCompetencyList(x);
        this.setState({
          competency_dropdown: x.map((result, key) => {
            return (
              <option value={result.id} key={result.id}>
                {result.label}
              </option>
            );
          })
        });
        e.target.updateCompetencyName.value = "";
      } else alert(res.message);
    });
  };

  changeNumberOfNewCompetency = e => {
    this.setState({ no_of_new_competency: e.target.value });
    const items = [];
    for (let i = 1; i <= e.target.value; i++) {
      items.push(
        <Row key={i}>
          <Col md={6}>
            <FormGroup controlId="formHorizontalEmail">
              <ControlLabel>
                Enter Names Of Competency to be Created:
              </ControlLabel>
              <FormControl
                type="text"
                placeholder="Enter Competency Name"
                bsClass="form-control question-dropdown"
                required
                key={i}
                inputRef={element =>
                  element ? this.state.new_competencies_label.push(element) : ""
                }
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup controlId="formHorizontalEmail">
              <ControlLabel>Add Description to Your Competency:</ControlLabel>
              <FormControl
                type="text"
                placeholder="Enter Competency Description"
                bsClass="form-control question-dropdown"
                key={i}
                inputRef={element =>
                  element
                    ? this.state.new_competencies_description.push(element)
                    : ""
                }
              />
            </FormGroup>
          </Col>
        </Row>
      );
    }
    this.setState({ new_competency: items });
  };

  changeActiveStatus = e => {
    if (e.target.value !== "0")
      this.setState({
        active_status: this.props.main_competency_list.filter(
          x => x.id === e.target.value
        )[0].active
      });
    else
      this.setState({
        active_status: false
      });
  };

  changeCompetencyStatus = e => {
    e.preventDefault();
    CompetencyApi.UpdateCompetencyStatusApi({
      token: localStorage.getItem("token"),
      competencyId: e.target.competencystatus.value,
      active: !this.state.active_status
    }).then(res => {
      if (res.code === "0") {
        let x = this.props.main_competency_list;
        x.forEach(data => {
          if (data.id === res.data.id) data.active = res.data.active;
        });
        this.props.updateCompetencyList(x);
        this.setState({
          active_status: res.data.active
        });
      }
    });
  };

  populateTags = e => {
    const tags = [];
    let description = "";
    if (e.target.value !== "0")
      this.props.main_competency_list.forEach(result => {
        if (result.id === e.target.value) {
          description = result.description;
          result.subCompetencyIds.forEach(data => {
            this.props.main_subcompetency_list.forEach(res => {
              if (data === res.id) tags.push(res.label);
            });
          });
        }
      });
    this.setState({ tempDesc: description, tags: tags });
  };

  updateTags = e => {
    if (e.target.value !== "0") {
      const competencyLabel = this.props.main_subcompetency_list.filter(
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
    if (props.main_competency_list && props.main_subcompetency_list) {
      CompetencyApi.GetCompetenciesApi().then(res => {
        this.setState({
          competency_dropdown: props.main_competency_list.map(result => {
            return (
              <option value={result.id} key={result.id}>
                {result.label}
              </option>
            );
          })
        });
      });
      SubCompetencyApi.GetSubCompetenciesApi().then(res => {
        this.setState({
          subcompetency_dropdown: props.main_subcompetency_list.map(result => {
            return (
              <option value={result.id} key={result.id}>
                {result.label}
              </option>
            );
          })
        });
      });
    }
  }

  render() {
    return (
      <Fragment>
        <h5>Add New Competency</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.addNewCompetency}>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <ControlLabel>
                            Enter Number of Competency to be Created:
                          </ControlLabel>
                          <FormControl
                            type="text"
                            placeholder="Number Of Competency"
                            bsClass="form-control question-dropdown"
                            required
                            value={this.state.no_of_new_competency}
                            onChange={this.changeNumberOfNewCompetency}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {this.state.new_competency}
                    <Row>
                      <Col md={12} style={{ marginTop: "-20px" }}>
                        <SubmitButton buttonName="Add New Competencies" />
                      </Col>
                    </Row>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Row>
          </Grid>
        </div>
        <h5>Update Existing Competency</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.editExistingCompetency}>
                    <Row>
                      <Col md={3}>
                        <FormGroup>
                          <ControlLabel>Competency Name:</ControlLabel>
                          <FormControl
                            componentClass="select"
                            bsClass="form-control question-dropdown"
                            onChange={this.populateTags}
                            name="updatecompetency"
                          >
                            <option value="0">Select Type</option>
                            {this.state.competency_dropdown.map((data, key) => {
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
                            name="updateCompetencyName"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <ControlLabel>Update Description:</ControlLabel>
                          <FormControl
                            type="text"
                            value={this.state.tempDesc}
                            placeholder="Enter New Desciption"
                            bsClass="form-control question-dropdown"
                            name="updateCompetencyDescription"
                            onChange={e => this.setState({tempDesc: e.target.value})}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <ControlLabel>Add Sub-Competency:</ControlLabel>
                          <FormControl
                            componentClass="select"
                            bsClass="form-control question-dropdown"
                            name="addcompetency"
                            onChange={this.updateTags}
                          >
                            <option value="0">Select Type</option>
                            {this.state.subcompetency_dropdown.map(data => {
                              return data;
                            })}
                          </FormControl>
                        </FormGroup>
                      </Col>
                    </Row>
                    <TagsInput
                      value={this.state.tags}
                      removeTag={this.removeTags}
                      label="Existing Competency:"
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
        <h5>Enable/Disable Existing Competency</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.changeCompetencyStatus}>
                    <Row>
                      <Col md={4}>
                        <FormGroup
                          validationState={
                            this.state.active_status ? "success" : "error"
                          }
                        >
                          <ControlLabel>Competency Name:</ControlLabel>
                          <FormControl
                            componentClass="select"
                            bsClass="form-control"
                            name="competencystatus"
                            onChange={this.changeActiveStatus}
                          >
                            <option value="0">Select Type</option>
                            {this.state.competency_dropdown.map((data, key) => {
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
