import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormControl,
  FormGroup,
  ControlLabel,
  Modal,
  Button
} from "react-bootstrap";
import * as SkillsApi from "api/SkillApi";
import TagsInput from "../../components/TagInput/TagsInput";

export default class SkillSelection extends Component {
  state = {
    skill_list: [],
    skills_dropdown: [],
    tags: []
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
    for (let i = 0; i < this.state.tags.length; i++) {
      x = this.state.skill_list.filter(
        data => data.label === this.state.tags[i]
      );
    }
    this.props.onHide(x);
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
  }

  render() {
    return (
      <Modal
        {...this.props}
        bsSize="large"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">
            Select The Skills In Which You Want To Contribute..
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
            </Grid>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
