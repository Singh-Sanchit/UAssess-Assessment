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
                  />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Enter an answer choice"
                  bsClass="form-control question-dropdown"
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
