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


export default class TestSideBar extends Component {
    constructor() {
        super();
        
        
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
        if(sessionStorage.getItem('u_profileImage')){
            this.setState({profileImage : sessionStorage.getItem('u_profileImage')})
        }else{
            this.setState({profileImage : "../../../userCommon.png" })
        }
        $('[data-toggle="push-menu"]').pushMenu('toggle');
        var x = document.getElementById("nameAndEmail");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
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
                
            } else {
                alert(data.message);
            }
               
        })
        .catch((err)=>console.log(err))
        
        
      }
    clearModalContent(){
        $('#alertBox-getTest').modal('show');
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $('[data-toggle="push-menu"]').pushMenu('toggle');
        }
        
    }
    render(){
        if(!sessionStorage.getItem('u_token')){
            window.location.href='/';
        }
        return (
            <aside style={divStyle} className="main-sidebar fixed">
                <section className="sidebar">
                    
                    <div className="user-panel" style={userPanel}> 
                        <div className="text-center image">
                            <img src={this.state.profileImage} className="img-circle" alt="User Image" />
                            <p id="nameAndEmail" className="userInfo">{sessionStorage.getItem('u_name')} <br/>
                            <small>{sessionStorage.getItem('u_email')}</small></p>
                        </div>
                    </div><br/>
                    
                    <ul className="sidebar-menu" data-widget="tree" style={ulContent}>
                        <li className="assessmentMenu activeMenu">
                        {/* data-id="Assessments" data-toggle="modal" data-target="#alertBox-assessment" */}
                            <a href="#" style={color} data-toggle="modal" data-target="#alertBox-assessment" >
                            <i className="fa fa-list-ul" aria-hidden="true"></i>
                                <span>&nbsp;Assessment</span>
                            </a>
                            {/* <Link onClick={this.setActiveTab} style={color} to={'/assessments'}><i className="fa fa-list-ul"></i>&nbsp;<span>Assessment</span></Link> */}
                        </li>
                        <li className="gettestMenu">
                            <a href="#" onClick={this.clearModalContent} style={color} >
                            <i className="fa fa-download" aria-hidden="true"></i><span>Get Assessment</span>
                            </a>
                        </li>
                        <li className="myprofileMenu">
                            <a href="#" style={color}  data-toggle="modal" data-target="#alertBox-profile" >
                                <i className="fa fa-user-o"></i>&nbsp;<span>My Profile</span>
                            </a>
                            {/* <Link style={color} to={'/profile'}><i className="fa fa-user-o"></i>&nbsp;<span>My Profile</span></Link> */}
                        </li>
                        <li className="feedbackMenu">
                        {/* <Link to={'/feedback'} style={color}><i className="fa fa-upload" aria-hidden="true"></i><span> Feedback </span></Link> */}
                            <a href="#" style={color}  data-toggle="modal" data-target="#alertBox-feedback">
                            <i className="fa fa-upload" aria-hidden="true"></i>&nbsp;
                                <span>Feedback</span>
                            </a>
                        </li>
                        
                        
                       
                        <li>
                            <a href="#" data-toggle="modal" data-target="#alertBox-signout" style={color}>
                                <i className="fa fa-power-off" ></i>&nbsp;<span>Sign Out</span>
                            </a>
                        </li>
                    </ul>
                </section>
                
            </aside> 
        )
    }
}