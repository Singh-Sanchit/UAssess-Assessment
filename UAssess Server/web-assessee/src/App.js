import React, { Component } from 'react';
import { Switch} from 'react-router-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router'
// import Layout from './Components/Layout/Layout';
import './App.css';


import Assessee from './Components/AssesseeLogin/Assessee';
import Content from './Components/Content/Content';
import Assessments from './Components/Assessments/Assessments';
import StartAssessment from './Components/StartAssessment/StartAssessment';
import Header from './Components/Header/Header';
import SideBar from './Components/SideBar/SideBar.js';
import Footer from './Components/Footer/Footer.js';
import Register from './Components/Register/Register';
import SurveyComponent from'./Components/TestPage/TestPage';
import Summary from './Components/Summary/Summary';
import Profile from './Components/Profile/Profile';
import Feedback from './Components/Feedback/Feedback';
import GetTest from './Components/Assessments/GetTest';

import { withRouter, BrowserRouter } from 'react-router-dom';
import ReactSurvey from './Components/TestPage/Survey';
// import history from "../node_modules/history/createBrowserHistory";
 
class App extends Component {
  constructor(props){
  super(props);
       
  this.showConfirm = this.showConfirm.bind(this);
}
showConfirm(){
  alert("afjsfjgjdjgdfkkgkgggn");
}

  render() {
    return (                                
      <BrowserRouter >
        <Switch>
        {/* <Router history={ history }> */}
        <Route exact path="/" component={Assessee} />
        <Route exact path="/login/:id" component={Assessee} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/gettest" component={GetTest} />
        <Route exact path="/content" component={Content} />

        <Route exact path="/react-survey" component={ReactSurvey} />

        
        <Route exact path="/survey/:key/:noq" component={SurveyComponent} />
        <Route exact path="/survey/:key/:noq/:qno" component={SurveyComponent} />
        {/* <Layout> */}
              <div className="main">
                <Header/>
                <SideBar />
                {/* <Main> */}
                <Route exact path="/feedback" component={Feedback} />
                <Route exact path="/assessments" component={Assessments} />
                <Route exact path="/start/:id" component={StartAssessment} />
                {/* <Route exact path="/content" component={Content} /> */}
                
                <Route exact path ="/summary/:reportId"   component={Summary} />
                
                {/* </Main> */}
                <Footer />
              </div>
        
        {/* </Layout> */}
        {/* </Router> */}
        </Switch>
        </BrowserRouter>    );
  }
}

export default withRouter(App);