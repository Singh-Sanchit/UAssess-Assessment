import React, {Component} from 'react';
import  "./SideBar.css";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {Prompt} from "react-router-dom";
import { apiRoot } from '../../config';

const divStyle = {
    background :"#3c8dbc",
    color :"white"
};
const color={
    color :"white"
}

const ulContent={
    // paddingLeft :'10px',
}
const userPanel={
    marginTop:'-45px'
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
           name:'',
           email:'',
           message: 'You are Logged In',
           profileImage:'',
         isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true'
        }
        this.logout = this.logout.bind(this);
    }
    componentDidMount(){
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
                    <div className="user-panel" style={userPanel}> 
                        <div className="text-center image">
                            <img src={this.state.profileImage} className="img-circle" alt="User Image" />
                            <p id="nameAndEmail" className="userInfo">{sessionStorage.getItem('u_name')} <br/>
                            <small>{sessionStorage.getItem('u_email')}</small></p>
                        </div>
                    </div><br/>
                    
                    <ul className="sidebar-menu" data-widget="tree" style={ulContent}>
                        <li className="assessmentMenu activeMenu">
                            {/* <a href={"/assessments"} onClick={this.setActiveTab} style={color} >
                            <i className="fa fa-list-ul" aria-hidden="true"></i>
                                <span>&nbsp;Assessment</span>
                            </a> */}
                            <Link style={color} to={'/assessments'}><i className="fa fa-list-ul"></i>&nbsp;<span>Assessment</span></Link>
                        </li>
                        <li className="gettestMenu">
                        {/* data-toggle="modal" data-target="#getTestDiv" aria-controls="navbarNavAltMarkup" aria-expanded="false" */}
                            <a href="#" style={color} onClick={this.clearModalContent} >
                            <i className="fa fa-download" aria-hidden="true"></i><span>Get Assessment</span>
                            </a>
                        </li>
                        <li className="myprofileMenu">
                            {/* <a href="#" style={color} onClick={this.setMyProfile}>
                                <i className="fa fa-user-o"></i>&nbsp;<span>My Profile</span>
                            </a> */}
                            <Link style={color} to={'/profile'}><i className="fa fa-user-o"></i>&nbsp;<span>My Profile</span></Link>
                        </li>
                        <li className="feedbackMenu">
                        <Link to={'/feedback'} style={color}><i className="fa fa-upload" aria-hidden="true"></i><span> Feedback </span></Link>
                            {/* <a href="#" style={color}  onClick={this.setFeedback} >
                            <i className="fa fa-upload" aria-hidden="true"></i>&nbsp;
                                <span>Feedback</span>
                            </a> */}
                        </li>
                        
                        
                        {/* <li className="contactMenu">
                            <a href="#" style={color} data-toggle="tooltip" data-placement="top" title="Coming Soon">
                                <i className="fa fa-phone"></i>&nbsp;<span>Contact</span>
                            </a>
                        </li> */}
                        <li>
                            <a href="#" onClick={this.logout} style={color}>
                                <i className="fa fa-power-off" ></i>&nbsp;<span>Sign Out</span>
                            </a>
                        </li>
                    </ul>
                {/* </section> */}
            </aside> 
        )
    }
}