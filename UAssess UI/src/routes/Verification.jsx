import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NotificationSystem from "react-notification-system";
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import { style } from "variables/Variables.jsx";
import MainRoutes from "routes/MainRoutes.jsx";
import Login from "views/Authentication/Login.jsx";

export default class Verification extends Component {
  state = {
    redirectToLoginPage: false,
    _notificationSystem: null
  };

  logoutUser = () => {
    localStorage.setItem("user_status", " ");
    this.setState({ redirectToLoginPage: true });
  };

  handleNotificationClick = position => {
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
    this.state._notificationSystem.addNotification({
      title: <span className="fa fa-user" aria-hidden="true" />,
      message: (
        <div>
          Welcome to <b>UAssess Web Test</b>
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 15
    });
  };

  componentDidMount = () => {
    if (localStorage.getItem("user_status") === "User_Logged_In") {
      this.setState({ _notificationSystem: this.refs.notificationSystem });
      var _notificationSystem = this.refs.notificationSystem;
      var color = Math.floor(Math.random() * 4 + 1);
      var level;
      switch (color) {
        case 1:
          level = "success";
          break;
        case 2:
          level = "warning";
          break;
        case 3:
          level = "error";
          break;
        case 4:
          level = "info";
          break;
        default:
          break;
      }
      _notificationSystem.addNotification({
        title: <span className="fa fa-gift" aria-hidden="true" />,
        message: (
          <div>
            Welcome to <b>UAssess Web Test</b>
          </div>
        ),
        level: level,
        position: "tr",
        autoDismiss: 15
      });
    }
  };

  componentDidUpdate = e => {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  };

  render() {
    return localStorage.getItem("user_status") === "User_Logged_In" ? (
      <div className="wrapper">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Sidebar {...this.props} />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <Header {...this.props} />
          <Switch>
            {MainRoutes.map((prop, key) => {
              if (prop.redirect)
                return <Redirect from={prop.path} to={prop.to} key={key} />;
              return (
                <Route
                  exact
                  path={prop.path}
                  component={prop.component}
                  key={key}
                  page={prop.page}
                />
              );
            })}
          </Switch>
          <Footer />
        </div>
      </div>
    ) : (
      <div className="wrapper">
        <Switch>
          <Route exact path="/" component={Login} />
          <Redirect from="*" to="/" />
        </Switch>
      </div>
    );
  }
}
