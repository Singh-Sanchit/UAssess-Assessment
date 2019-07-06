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
import * as LevelApi from "../../api/LevelApi";

export default class Level extends Component {
  state = {
    level_dropdown: [],
    active_status: false,
    tempDesc: ""
  };

  addNewLevel = e => {
    e.preventDefault();
    e.persist();
    let data = {};
    if (e.target.leveldesc.value === "")
      data = {
        token: localStorage.getItem("token"),
        label: e.target.levelname.value,
        levelNo: e.target.levelno.value,
        time: e.target.leveltime.value
      };
    else
      data = {
        token: localStorage.getItem("token"),
        label: e.target.levelname.value,
        levelNo: e.target.levelno.value,
        description: e.target.leveldesc.value,
        time: e.target.leveltime.value
      };
    LevelApi.CreateLevelApi(data).then(res => {
      if (res.code === "0") {
        alert(res.message);
        let x = this.props.main_level_list;
        if (x) {
          x.push(res.data);
          this.props.updateLevelList(x);
          this.setState({
            level_dropdown: x.map(result => {
              return (
                <option value={result.id} key={result.id}>
                  {result.label}
                </option>
              );
            })
          });
        }
        e.target.levelname.value = "";
        e.target.leveldesc.value = "";
        e.target.levelno.value = "";
        e.target.leveltime.value = "";
      } else alert(res.message);
    });
  };

  editExistingLevel = e => {
    e.preventDefault();
    e.persist();
    if (e.target.updatelevel.value === "0") return;
    let data = {};
    if (e.target.updateLevelName.value && e.target.updateLevelDescription.value)
      data = {
        token: localStorage.getItem("token"),
        levelId: e.target.updatelevel.value,
        label: e.target.updateLevelName.value,
        description: e.target.updateLevelDescription.value
      };
    else if (e.target.updateLevelName.value)
      data = {
        token: localStorage.getItem("token"),
        levelId: e.target.updatelevel.value,
        label: e.target.updateLevelName.value
      };
    else if (e.target.updateLevelDescription.value)
      data = {
        token: localStorage.getItem("token"),
        levelId: e.target.updatelevel.value,
        description: e.target.updateLevelDescription.value
      };
    LevelApi.UpdateLevelApi(data).then(res => {
      if (res.code === "0") {
        alert(res.message);
        let x = this.props.main_level_list;
        x.forEach(data => {
          if (data.id === res.data.id) data.label = res.data.label;
        });
        this.props.updateLevelList(x);
        this.setState({
          level_dropdown: x.map(result => {
            return (
              <option value={result.id} key={result.id}>
                {result.label}
              </option>
            );
          })
        });
        e.target.updatelevel.value = "";
      } else alert(res.message);
    });
  };

  changeActiveStatus = e => {
    if (e.target.value !== "0")
      this.setState({
        active_status: this.props.main_level_list.filter(
          x => x.id === e.target.value
        )[0].active
      });
    else
      this.setState({
        active_status: false
      });
  };

  changeLevelStatus = e => {
    e.preventDefault();
    LevelApi.UpdateLevelStatusApi({
      token: localStorage.getItem("token"),
      levelId: e.target.subcompetencystatus.value,
      active: !this.state.active_status
    }).then(res => {
      if (res.code === "0") {
        let x = this.props.main_level_list;
        x.forEach(data => {
          if (data.id === res.data.id) data.active = res.data.active;
        });
        this.props.updateLevelList(x);
        this.setState({
          active_status: res.data.active
        });
      }
    });
  };

  componentWillReceiveProps(props) {
    if (props.main_level_list)
      this.setState({
        level_dropdown: props.main_level_list.map(result => {
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
      this.props.main_level_list.forEach(result => {
        if (result.id === e.target.value) description = result.description;
      });
    this.setState({ tempDesc: description });
  };

  render() {
    return (
      <Fragment>
        <h5>Add New Level</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.addNewLevel}>
                    <Row>
                      <Col md={3}>
                        <FormGroup controlId="formHorizontalEmail">
                          <ControlLabel>Add Name:</ControlLabel>
                          <FormControl
                            type="text"
                            placeholder="Enter Level Name"
                            bsClass="form-control question-dropdown"
                            required
                            name="levelname"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup controlId="formHorizontalEmail">
                          <ControlLabel>Add Description:</ControlLabel>
                          <FormControl
                            type="text"
                            placeholder="Enter Level Description"
                            bsClass="form-control question-dropdown"
                            name="leveldesc"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup controlId="formHorizontalEmail">
                          <ControlLabel>Add Level Number:</ControlLabel>
                          <FormControl
                            type="text"
                            placeholder="Enter Level Number"
                            bsClass="form-control question-dropdown"
                            required
                            name="levelno"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup controlId="formHorizontalEmail">
                          <ControlLabel>Add Time:</ControlLabel>
                          <FormControl
                            type="text"
                            placeholder="Enter Level Time"
                            bsClass="form-control question-dropdown"
                            required
                            name="leveltime"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} style={{ marginTop: "-20px" }}>
                        <SubmitButton buttonName="Add New Level" />
                      </Col>
                    </Row>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Row>
          </Grid>
        </div>
        <h5>Update Existing Level</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.editExistingLevel}>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <ControlLabel>Level Name:</ControlLabel>
                          <FormControl
                            componentClass="select"
                            bsClass="form-control question-dropdown"
                            name="updatelevel"
                            onChange={this.populateTags}
                          >
                            <option value="0">Select Type</option>
                            {this.state.level_dropdown.map((data, key) => {
                              return data;
                            })}
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
                            name="updateLevelName"
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
                            name="updateLevelDescription"
                            onChange={e =>
                              this.setState({ tempDesc: e.target.value })
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} style={{ marginTop: "-20px" }}>
                        <SubmitButton buttonName="Update Level" />
                      </Col>
                    </Row>
                  </form>
                }
              />
            </Row>
          </Grid>
        </div>
        <h5>Enable/Disable Existing Level</h5>
        <div className="content">
          <Grid fluid>
            <Row>
              <Card
                skills="true"
                content={
                  <form onSubmit={this.changeLevelStatus}>
                    <Row>
                      <Col md={4}>
                        <FormGroup
                          validationState={
                            this.state.active_status ? "success" : "error"
                          }
                        >
                          <ControlLabel>Level Name:</ControlLabel>
                          <FormControl
                            componentClass="select"
                            bsClass="form-control"
                            name="subcompetencystatus"
                            onChange={this.changeActiveStatus}
                          >
                            <option value="0">Select Type</option>
                            {this.state.level_dropdown.map((data, key) => {
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
