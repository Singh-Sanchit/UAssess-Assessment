import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Verification from "routes/Verification.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/css/main.css";
import "./assets/css/demo.css";
import "./assets/css/navigationtab.css";
import "./assets/css/tag.css";
import "./assets/css/403page.css";
import "./assets/css/switchtoggle.css";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route to="/" component={Verification}/>;
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
