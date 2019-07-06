import React, {Component} from 'react';
import  "./SideBar.css";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { apiRoot } from '../../config';

const divStyle = {
    background :"#3c8dbc",
    color :"white"
};
const color={
    color :"white"
}
const $ = window.$;
  
export default class SideBar extends Component {
    constructor() {
        super();
        this.setActiveTab = this.setActiveTab.bind(this)
        this.setFeedback = this.setFeedback.bind(this)
        this.setMyProfile = this.setMyProfile.bind(this)
        this.setLogout = this.setLogout.bind(this)
        this.clearModalContent =this.clearModalContent.bind(this)
        
        this.state = {
            currentPage: '',
            email:'',
            message: 'You are Logged In',
            status :'',
            isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true'
        }
        this.logout = this.logout.bind(this);
    }
    componentDidMount(){
        $('[data-toggle="tooltip"]').tooltip();
         if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $('[data-toggle="push-menu"]').pushMenu('toggle');
        }
        if(sessionStorage.getItem('u_profileImage')){
            this.setState({profileImage : sessionStorage.getItem('u_profileImage')})
        }else{
            this.setState({profileImage : "../../../userCommon.png" })
        }
    }

    logout() {
        let data = JSON.stringify({
            "token":sessionStorage.getItem('u_token'),           
        });
        fetch(apiRoot+'3000/api/logout', {
        method: 'POST',//
        headers : {
            'Content-Type': 'application/json'
        },
          body:data
        }).then((res) =>{ return res.json();})
          .then(data => {
            if(data.code === "0")
            { 
                sessionStorage.clear();
                this.setState({
                    isLoggedIn: false
                  });
                window.location.href = '/';
                
            } else {
                alert(data.message);
            }
        })
        .catch((err)=>console.log(err))
      }
    clearModalContent(){
        $('#getTestDiv').modal('show');
         if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $('[data-toggle="push-menu"]').pushMenu('toggle');
        }
    }
    setActiveTab(e) {
        console.log("e.target");
        window.location.href = "/assessments";
    }
    setFeedback(e) {
        console.log("e.target");
        window.location.href = "/feedback";
    }
    setMyProfile(e) {
        console.log("e.target");
        window.location.href = "/profile";
    }
    setLogout(){
        window.location.href = "/logout";
    }
    render(){
        if(!sessionStorage.getItem('u_token')){
            window.location.href='/';
        }
        return (
            <aside style={divStyle} className="main-sidebar">
                
                {/* <section className="sidebar"> */}
                    {/* <a style={toggle} href="#" className="fa fa-chevron-left" data-toggle="push-menu" role="button">
                        <span className="sr-only">Toggle navigation</span>
                    </a> */}
                    {/* <div className="user-panel" style={userPanel}> 
                        <div className="text-center image">
                            <img src={this.state.logo} className="img-circle" alt="User Image" />
                            <p id="nameAndEmail" className="userInfo">{this.state.companyName} <br/>
                            <small>{sessionStorage.getItem('u_email')}</small></p>
                        </div>
                    </div><br/> */}
                    
                    <ul className="sidebar-menu" data-widget="tree">
                        <li className="assessmentMenu activeMenu">
                            <Link style={color} to={'/assessments'}><i className="fa fa-bar-chart"></i>&nbsp;<span>Assessments</span></Link>
                        </li>
                        {/* <li className="gettestMenu">
                            <a href="#" style={color} >
                            <i className="fa fa-envelope-o" aria-hidden="true"></i>&nbsp;<span>Messages</span>
                            </a>
                        </li> */}
                        <li className="createAssessmentMenu">                            
                            <Link style={color} to={'/create'}><i className="fa fa-clone"></i>&nbsp;<span>Create Assessment</span></Link>
                        </li>
                        {/* <li className="helpMenu">
                            <Link to={'#'} style={color}><i className="fa fa-question-circle-o font19" aria-hidden="true"></i>&nbsp;<span>Help</span></Link>   
                        </li> */}
                        <li className="feedbackMenu">
                            <Link to={'/feedback'} style={color}><i className="fa fa-comments-o" aria-hidden="true"></i>&nbsp;<span>Feedback</span></Link>   
                        </li>
                        {/* <li className="settingsMenu">
                            <Link to={'#'} style={color}><i className="fa fa-sliders" aria-hidden="true"></i>&nbsp;<span>Settings</span></Link>   
                        </li>
                        <li className="aboutMenu">
                            <Link to={'#'} style={color}><i className="fa fa-send-o" aria-hidden="true"></i>&nbsp;<span>About App</span></Link>   
                        </li> */}
                        <li>
                            <a href="#" onClick={this.logout} style={color}>
                                <i className="fa fa-sign-out" ></i>&nbsp;<span>Sign Out</span>
                            </a>
                        </li>
                    </ul>
            </aside> 
        )
    }
}