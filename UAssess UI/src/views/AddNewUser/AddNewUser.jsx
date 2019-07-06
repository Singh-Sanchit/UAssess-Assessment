import React, { Component, Fragment } from "react";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import { Card } from "../../components/Card/Card";
import Button from "components/CustomButton/CustomButton";
import SweetAlert from "react-bootstrap-sweetalert";
import * as AuthenticationApi from "api/AuthenticationApi";

export default class AddNewUser extends Component {
  state = {
    alert: null
  };

  registerUser = e => {
    e.preventDefault();
    if (e.target.password.value !== e.target.cpassword.value) {
      this.setState({
        alert: (
          <SweetAlert
            danger
            title="Password Does Not Match!"
            onConfirm={() => {
              this.setState({ alert: null });
            }}
          />
        )
      });
      return;
    } else if (e.target.userrole.value === "0") {
      this.setState({
        alert: (
          <SweetAlert
            danger
            title="Please Select A Role!"
            onConfirm={() => {
              this.setState({ alert: null });
            }}
          />
        )
      });
      return;
    }
    AuthenticationApi.Register({
      email: e.target.username.value,
      password: e.target.password.value,
      name: e.target.name.value,
      privilegeRole: e.target.userrole.value,
      pushNotificationId: e.target.pushNotificationId.value,
      clientId: e.target.clientId.value,
      companyId: e.target.companyId.value,
      jobRole: e.target.jobRole.value
    }).then(res => {
      if (res.code === "0")
        this.setState({
          alert: (
            <SweetAlert
              success
              title={res.message}
              onConfirm={() => {
                this.setState({ alert: null });
              }}
            />
          )
        });
      else
        this.setState({
          alert: (
            <SweetAlert
              danger
              title={res.message}
              onConfirm={() => {
                this.setState({ alert: null });
              }}
            />
          )
        });
    });
  };

  render() {
    return (
      <Card
        title="Register New User For Assessment"
        header="true"
        content={
          <Fragment>
            <form onSubmit={this.registerUser}>
              <Row>
                <Col md={6}>
                  <FormGroup controlId="formHorizontalName">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                      type="text"
                      name="name"
                      placeholder="Enter Your Name"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <ControlLabel>Push Notification ID</ControlLabel>
                    <FormControl
                      type="text"
                      name="pushNotificationId"
                      placeholder="Enter Push Notification ID"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup controlId="formHorizontalEmail">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                      type="email"
                      name="username"
                      placeholder="Enter Email Id"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <ControlLabel>Client ID</ControlLabel>
                    <FormControl
                      type="text"
                      name="clientId"
                      placeholder="Enter Client ID"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup controlId="formHorizontalPassword">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <ControlLabel>Company ID</ControlLabel>
                    <FormControl
                      type="text"
                      name="companyId"
                      placeholder="Enter Company ID"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup controlId="formHorizontalConfirmPassword">
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
                      type="password"
                      name="cpassword"
                      placeholder="ConfirmPassword"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <ControlLabel>Job Role</ControlLabel>
                    <FormControl
                      type="text"
                      name="jobRole"
                      placeholder="Enter Job Role"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <ControlLabel>Select User Role</ControlLabel>
                    <FormControl
                      componentClass="select"
                      bsClass="form-control question-dropdown"
                      name="userrole"
                    >
                      <option value="0">Select Type</option>
                      <option value="Assessee">Assessee</option>
                      <option value="Author">Author</option>
                      <option value="Evaluator">Evaluator</option>
                    </FormControl>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="text-center" style={{ paddingBottom: "20px" }}>
                <Button bsStyle="info" fill type="submit">
                  Add New User
                </Button>
              </Row>
            </form>
            {this.state.alert}
          </Fragment>
        }
      />
    );
  }
}
