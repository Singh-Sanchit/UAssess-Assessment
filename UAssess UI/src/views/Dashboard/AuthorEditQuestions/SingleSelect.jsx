import React, { Component } from "react";
import {
  Row,
  Col,
  Grid,
  FormControl,
  FormGroup,
  InputGroup
} from "react-bootstrap";

export default class MultipleChoice extends Component {
  state = {
    label: "",
    optionStatus: false
  };
  componentDidMount() {
    this.setState({ label: this.props.optionLabel, optionStatus: this.props.optionRightStatus });
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col md={10}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon>
                  <input
                    type="radio"
                    aria-label="..."
                    value={this.props.selectValue}
                    name="radiogroup"
                    checked={this.state.optionStatus}
                    onChange={e => this.setState({optionStatus: !this.state.optionStatus})}
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
