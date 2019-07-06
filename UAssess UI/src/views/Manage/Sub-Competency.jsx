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
import * as SubCompetencyApi from "../../api/SubCompetencyApi";

export default class SubCompetency extends Component {
  state = {
    new_subcompetencies_label: [],
    new_subcompetencies_description: [],
    no_of_new_subcompetency: "",
    subcompetency_dropdown: [],
    active_status: false,
    tempDesc: ""
  };

  addNewSubCompetency = e => {
    e.preventDefault();
    let subCompetencies_label = [];
    for (let i = 0; i < this.state.new_subcompetencies_label.length; i++)
      if (
        this.state.new_subcompetencies_description[i].value !== "" &&
        this.state.new_subcompetencies_description[i].value
      )
        subCompetencies_label.push({
          label: this.state.new_subcompetencies_label[i].value,
          description: this.state.new_subcompetencies_description[i].value
        });
      else
        subCompetencies_label.push({
          label: this.state.new_subcompetencies_label[i].value
        });
    SubCompetencyApi.CreateSubCompetencyApi({
      token: localStorage.getItem("token"),
      subCompetencies: subCompetencies_label
    }).then(res => {
      if (res.code === "0") {
        alert(res.message);
        let x = this.props.main_subcompetency_list;
        res.data.forEach(data => x.push(data));
        this.props.updateSubCompetencyList(x);
        this.setState({
          new_subcompetencies_label: [],
          new_subcompetencies_description: [],
          subcompetency_dropdown: x.map((result, key) => {
            return (
              <option value={result.id} key={result.id}>
                {result.label}
              </option>
            );
          })
        });
        this.changeNumberOfNewSubCompetency({ target: { value: "" } });
      } else alert(res.message);
    });
  };

  editExistingSubCompetency = e => {
    e.preventDefault();
    e.persist();
    if (e.target.updatesubcompetency.value === "0") return;
    let data = {};
    if (
      e.target.updateSubCompetencyName.value &&
      e.target.updateSubCompetencyDescription.value
    )
      data = {
        token: localStorage.getItem("token"),
        subCompetencyId: e.target.updatesubcompetency.value,
        label: e.target.updateSubCompetencyName.value,
        description: e.target.updateSubCompetencyDescription.value
      };
    else if (e.target.updateSubCompetencyName.value)
      data = {
        token: localStorage.getItem("token"),
        subCompetencyId: e.target.updatesubcompetency.value,
        label: e.target.updateSubCompetencyName.value
      };
    else if (e.target.updateSubCompetencyDescription.value)
      data = {
        token: localStorage.getItem("token"),
        subCompetencyId: e.target.updatesubcompetency.value,
        description: e.target.updateSubCompetencyDescription.value
      };
    SubCompetencyApi.UpdateSubCompetencyApi(data).then(res => {
      if (res.code === "0") {
        alert(res.message);
        let x = this.props.main_subcompetency_list;
        x.forEach(data => {
          if (data.id === res.data.id) data.label = res.data.label;
        });
        this.props.updateSubCompetencyList(x);
        this.setState({
          subcompetency_dropdown: x.map((result, key) => {
            return (
              <option value={result.id} key={result.id}>
                {result.label}
              </option>
            );
          })
        });
        e.target.updateSubCompetencyName.value = "";
      } else alert(res.message);
    });
  };

  changeNumberOfNewSubCompetency = e => {
    this.setState({ no_of_new_subcompetency: e.target.value });
    const items = [];
    for (let i = 1; i <= e.target.value; i++) {
      items.push(
        <Row key={i}>
          <Col md={6}>
            <FormGroup controlId="formHorizontalEmail">
              <ControlLabel>
                Enter Names Of Sub-Competency to be Created:
              </ControlLabel>
              <FormControl
                type="text"
                placeholder="Enter Sub-Competency Name"
                bsClass="form-control question-dropdown"
                required
                key={i}
                inputRef={element =>
                  element
                    ? this.state.new_subcompetencies_label.push(element)
                    : ""
                }
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup controlId="formHorizontalEmail">
              <ControlLabel>Add Description:</ControlLabel>
              <FormControl
                type="text"
                placeholder="Enter Sub-Competency Description"
                bsClass="form-control question-dropdown"
                key={i}
                inputRef={element =>
                  element
                    ? this.state.new_subcompetencies_description.push(element)
                    : ""
                }
              />
            </FormGroup>
          </Col>
        </Row>
      );
    }
    this.setState({ new_subcompetency: items });
  };

  changeActiveStatus = e => {
    if (e.target.value !== "0")
      this.setState({
        active_status: this.props.main_subcompetency_list.filter(
          x => x.id === e.target.value
        )[0].active
      });
    else
      this.setState({
        active_status: false
      });
  };

  changeSubCompetencyStatus = e => {
    e.preventDefault();
    SubCompetencyApi.UpdateSubCompetencyStatusApi({
      token: localStorage.getItem("token"),
      subCompetencyId: e.target.subcompetencystatus.value,
      active: !this.state.active_status
    }).then(res => {
      if (res.code === "0") {
        let x = this.props.main_subcompetency_list;
        x.forEach(data => {
          if (data.id === res.data.id) data.active = res.data.active;
        });
        this.props.updateSubCompetencyList(x);
        this.setState({
          active_status: res.data.active
        });
      }
    });
  };

  componentWillReceiveProps(props) {
    if (props.main_subcompetency_list)
      this.setState({
        subcompetency_dropdown: props.main_subcompetency_list.map(result => {
          return (
            <option value={result.id} key={result.id}>
              {result.label}
            </option>
          );
        })
      });
  }

  populateTags = e => {
    let description = "";
    if (e.target.value !== "0")
      this.props.main_subcompetency_list.forEach(result => {
        if (result.id === e.target.value) description = result.description;
      });
    this.setState({ tempDesc: description });
  };

  render() {
    return (
      <Fragment>
        <h5>Add New Sub-Competency</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.addNewSubCompetency}>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <ControlLabel>
                            Enter Number of Sub-Competency to be Created:
                          </ControlLabel>
                          <FormControl
                            type="text"
                            placeholder="Number Of Sub-Competency"
                            bsClass="form-control question-dropdown"
                            required
                            value={this.state.no_of_new_subcompetency}
                            onChange={this.changeNumberOfNewSubCompetency}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {this.state.new_subcompetency}
                    <Row>
                      <Col md={12} style={{ marginTop: "-20px" }}>
                        <SubmitButton buttonName="Add New Sub-Competencies" />
                      </Col>
                    </Row>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Row>
          </Grid>
        </div>
        <h5>Update Existing Sub-Competency</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.editExistingSubCompetency}>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <ControlLabel>Sub-Competency Name:</ControlLabel>
                          <FormControl
                            componentClass="select"
                            bsClass="form-control question-dropdown"
                            onChange={this.populateTags}
                            name="updatesubcompetency"
                          >
                            <option value="0">Select Type</option>
                            {this.state.subcompetency_dropdown.map(
                              (data, key) => {
                                return data;
                              }
                            )}
                          </FormControl>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <ControlLabel>Update Name:</ControlLabel>
                          <FormControl
                            type="text"
                            placeholder="Enter New Name"
                            bsClass="form-control question-dropdown"
                            name="updateSubCompetencyName"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <ControlLabel>Update Description:</ControlLabel>
                          <FormControl
                            type="text"
                            value={this.state.tempDesc}
                            placeholder="Enter New Desciption"
                            bsClass="form-control question-dropdown"
                            name="updateSubCompetencyDescription"
                            onChange={e =>
                              this.setState({ tempDesc: e.target.value })
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} style={{ marginTop: "-20px" }}>
                        <SubmitButton buttonName="Update Skill" />
                      </Col>
                    </Row>
                  </form>
                }
              />
            </Row>
          </Grid>
        </div>
        <h5>Enable/Disable Existing Sub-Competency</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.changeSubCompetencyStatus}>
                    <Row>
                      <Col md={4}>
                        <FormGroup
                          validationState={
                            this.state.active_status ? "success" : "error"
                          }
                        >
                          <ControlLabel>Sub-Competency Name:</ControlLabel>
                          <FormControl
                            componentClass="select"
                            bsClass="form-control"
                            name="subcompetencystatus"
                            onChange={this.changeActiveStatus}
                          >
                            <option value="0">Select Type</option>
                            {this.state.subcompetency_dropdown.map(
                              (data, key) => {
                                return data;
                              }
                            )}
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
