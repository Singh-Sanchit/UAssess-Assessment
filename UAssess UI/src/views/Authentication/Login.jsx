import React, { Component, Fragment } from "react";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import SweetAlert from "react-bootstrap-sweetalert";
import * as AuthenticationApi from "../../api/AuthenticationApi";
import * as UserApi from "../../api/UserApi";

export default class Login extends Component {
  state = {
    alert: null
  };

  checkUser = e => {
    e.preventDefault();
    AuthenticationApi.Login({
      clientId: "2431",
      authType: "Default",
      userId: e.target.username.value,
      password: e.target.password.value,
      appVersion: "0.2"
    }).then(res => {
      if (res.code === "0") {
        let x = res.data.privilegeRoles;
        if (
          x.includes("UassessAdmin") ||
          x.includes("Author") ||
          x.includes("Evaluator")
        ) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "user_role",
            JSON.stringify(res.data.privilegeRoles)
          );
          localStorage.setItem("user_status", "User_Logged_In");
          if(x.includes("UassessAdmin")){
            localStorage.setItem("SelectSkill", false);
            localStorage.setItem("AdminStatus", true);
          }
          else
            localStorage.setItem("SelectSkill", true);
          UserApi.getMyProfileApi({
            token: res.data.token
          }).then(res => {
            if (res.code === "0") localStorage.setItem("user_id", res.data.id);
          });
          this.props.history.push("/");
        } else
          this.setState({
            alert: (
              <SweetAlert
                danger
                title="You are not authorized to view this section"
                onConfirm={() => {
                  this.setState({ alert: null });
                }}
              />
            )
          });
      } else
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
      <Fragment>
        <div className="login-container">
          <div>
            <h3 className="text-center">UASSESS</h3>
            <Card
              title="Edit Profile"
              login="true"
              content={
                <Fragment>
                  <p>Sign in to start your Assessment</p>
                  <form onSubmit={this.checkUser}>
                    <FormGroup controlId="formHorizontalEmail">
                      <ControlLabel>Email</ControlLabel>
                      <FormControl
                        type="email"
                        name="username"
                        placeholder="Email"
                        required
                      />
                    </FormGroup>
                    <FormGroup controlId="formHorizontalPassword">
                      <ControlLabel>Password</ControlLabel>
                      <FormControl
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Button bsStyle="info" fill type="submit">
                        Sign In
                      </Button>
                    </FormGroup>
                  </form>
                </Fragment>
              }
            />
          </div>
        </div>
        {this.state.alert}
      </Fragment>
    );
  }
}
