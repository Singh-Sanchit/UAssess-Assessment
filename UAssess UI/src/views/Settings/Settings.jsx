import React, { Component, Fragment } from "react";
import {
  Grid,
  Row,
  Col,
  FormControl,
  FormGroup,
  ControlLabel
} from "react-bootstrap";
import * as SkillsApi from "api/SkillApi";
import Button from "../../components/CustomButton/CustomButton.jsx";
import TagsInput from "../../components/TagInput/TagsInput";
import SweetAlert from "react-bootstrap-sweetalert";

export default class Settings extends Component {
  state = {
    skill_list: [],
    skills_dropdown: [],
    tags: [],
    alert: null
  };

  updateTags = e => {
    if (e.target.value !== "0") {
      const x = this.state.skill_list.filter(
        data => data.id === e.target.value
      )[0].label;
      if (!this.state.tags.includes(x))
        this.setState({
          tags: [...this.state.tags, x]
        });
    }
  };

  removeTags = e => {
    let index = this.state.tags.indexOf(e);
    this.setState({
      tags: this.state.tags.filter((_, i) => i !== index)
    });
  };

  handleClose = () => {
    let x = [];
    x = this.state.skill_list.filter(data =>
      this.state.tags.includes(data.label)
    );
    localStorage.setItem("SelectedSkills", JSON.stringify(x));
    this.setState({
      alert: (
        <SweetAlert
          success
          title="Updated Successfully"
          onConfirm={() => {
            this.setState({ alert: null });
          }}
        />
      )
    });
  };

  componentDidMount() {
    SkillsApi.GetSkillsApi({
      token: localStorage.getItem("token"),
      active: true
    }).then(res => {
      if (res.code === "0")
        this.setState({
          skill_list: res.data,
          skills_dropdown: res.data.map(result => {
            return (
              <option value={result.id} key={result.id}>
                {result.label}
              </option>
            );
          })
        });
    });
    let x = JSON.parse(localStorage.getItem("SelectedSkills"));
    let a = [];
    if (x) x.forEach(data => a.push(data.label));
    this.setState(prevState => {
      return { tags: [...a] };
    });
  }

  render() {
    return (
      <Fragment>
        <div className="content">
          <Grid fluid>
            <Row>
              <Col md={3}>
                <FormGroup>
                  <ControlLabel>List Of Skills:</ControlLabel>
                  <FormControl
                    componentClass="select"
                    bsClass="form-control question-dropdown"
                    name="skillselected"
                    onChange={this.updateTags}
                  >
                    <option value="0">Select Type</option>
                    {this.state.skills_dropdown.map(data => {
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
            <Button
              fill
              onClick={this.handleClose}
              style={{ marginTop: "20px" }}
            >
              Apply
            </Button>
          </Grid>
        </div>
        {this.state.alert}
      </Fragment>
    );
  }
}
