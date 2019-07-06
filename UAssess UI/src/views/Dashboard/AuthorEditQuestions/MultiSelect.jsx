import React, { Component } from "react";
import {
  Row,
  Col,
  Grid,
  FormControl,
  FormGroup,
  InputGroup
} from "react-bootstrap";

export default class Checkbox extends Component {
  state = {
    label: "",
    optionStatus: false
  };
  componentDidMount() {
    this.setState({
      label: this.props.optionLabel,
      optionStatus: this.props.optionRightStatus
    });
  }

  handleChange = e => {
    let found = 0;
    if (this.props.checkBoxValue.length > 0) {
      for (let i = 0; i < this.props.checkBoxValue.length; i++)
        if (this.props.checkBoxValue[i].name === e.target.value) {
          this.props.checkBoxValue[i].value = e.target.checked;
          found = 1;
          break;
        }
      if (found === 0)
        this.props.checkBoxValue.push({
          name: e.target.value,
          value: e.target.checked
        });
    } else
      this.props.checkBoxValue.push({
        name: e.target.value,
        value: e.target.checked
      });
    this.setState({optionStatus: !this.state.optionStatus})
  };
  render() {
    return (
      <Grid fluid>
        <Row>
          <Col md={10}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon>
                  <input
                    type="checkbox"
                    aria-label="..."
                    value={this.props.selectValue}
                    checked={this.state.optionStatus}
                    onChange={this.handleChange}
                  />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  value={this.state.label}
                  placeholder="Enter an answer choice"
                  bsClass="form-control question-dropdown"
                  onChange={e => this.setState({ label: e.target.value })}
                  inputRef={element =>
                    element ? this.props.optionValue.push(element) : ""
                  }
                  required
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md={2}>
            <i
              className="fa fa-plus-circle fa-2x option-icon"
              aria-hidden="true"
              onClick={this.props.changeOptionCount.bind(this, 1)}
            />
            &emsp;&emsp;
            <i
              className="fa fa-minus-circle fa-2x option-icon"
              aria-hidden="true"
              onClick={this.props.changeOptionCount.bind(this, -1)}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}
