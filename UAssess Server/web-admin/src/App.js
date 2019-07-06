import React, { Component } from 'react';
import { Switch} from 'react-router-dom';
import {BrowserRouter as Router,Route,Link} from 'react-router'
import { withRouter, BrowserRouter } from 'react-router-dom';

import './App.css';
import Login from './Components/Login/Login';
import Assessments from './Components/Assessments/Assessments';
import Header from './Components/Header/Header';
import SideBar from './Components/SideBar/SideBar.js';
import Footer from './Components/Footer/Footer.js';
import Profile from './Components/Profile/Profile';
import Feedback from './Components/Feedback/Feedback';
import Reports from './Components/Reports/Reports';
import CreateAssessment from './Components/Assessments/CreateAssessment';
import AssessmentForm from './Components/Assessments/AssessmentForm';
import TemplateForm from './Components/Assessments/Template';
 
class App extends Component {
  
  render() {
    return (                                
      <BrowserRouter >
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/profile" component={Profile} />
         
          
          <div className="main">
            <Header/>
            <SideBar />
            
            <Route exact path="/assessments" component={Assessments} />
            <Route exact path="/reports/:id" component={Reports} />
            <Route exact path="/create" component={CreateAssessment} />
            <Route exact path="/form/:id" component={AssessmentForm} />
            <Route exact path="/template/:id" component={TemplateForm} />
            <Route exact path="/feedback" component={Feedback} />
            
            <Footer />
          </div>
          
        </Switch>
        </BrowserRouter>    );
  }
}

export default withRouter(App);
