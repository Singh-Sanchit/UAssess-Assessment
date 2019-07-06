import React, {Component} from 'react';
import './Header.css';
import { apiRoot } from '../../config';

const $ = window.$;
const navbar = {
    background :"white",
    color :"black"
};
const color = {
    color :"#717171"
}
const searchForm={
    background:"white",
    // border: "1px solid white",
    border:'none'
}
const navbarBrand1={
    color : "#717171",
    fontSize : "2.3rem",
    // marginLeft : '40px',
    transition: 'height 1s, width 1s, padding 1s, visibility 1s, opacity 0.5s ease-out'
}
const navbarBrand2={
    color : "#717171",
    fontSize : "2.3rem",
    marginLeft : '-110px',
    display :'none',
    transition: 'height 1s, width 1s, padding 1s, visibility 1s, opacity 0.5s ease-out'
}
const logo={
    
}
const toggleBtn={
    marginLeft:'190px',
    marginTop:'20px',
    color:'white',
    fontSize:'25px'
}
const toggleBtnRight={
    marginLeft:'-160px',
    color:'white',
    boxShadox:'1px grey',
    fontSize:'25px',
    display:'none'
}
export default class Header extends Component {

    constructor(props){
        super(props);
       
        this.state = {
            status :'',
            companyName:'',
            logo:''
        }
        
        this.toggleClickLeft = this.toggleClickLeft.bind(this);
        this.toggleClickRight = this.toggleClickRight.bind(this);
        this.hideNameEmail=this.hideNameEmail.bind(this);
        
    }
    toggleClickLeft(){
        document.getElementById('toggleRight').style.display = 'block';
        document.getElementById('toggleLeft').style.display = 'none';//
        //document.getElementById('nameAndEmail').style.display = 'none';
        document.getElementById('assessment1').style.display = 'none';
        //document.getElementById('assessment2').style.display = 'block';
    }
    toggleClickRight(){
        document.getElementById('toggleRight').style.display = 'none';
        document.getElementById('toggleLeft').style.display = 'block';
        //document.getElementById('nameAndEmail').style.display = 'block';
        //document.getElementById('assessment2').style.display = 'none';
        document.getElementById('assessment1').style.display = 'block';

    }
    getCompany(){
        let data = JSON.stringify({
            "token":sessionStorage.getItem('u_token'),//"1-2-3",
            "companyId":sessionStorage.getItem('u_companyId')//"1234"           
        });

        fetch(apiRoot+'3000/api/get-company-profile', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(data =>{
            if(data.code === "0")
            {
                this.setState({companyName: data.data.name});
                this.setState({logo: data.data.logo});
            }else{
                console.log(JSON.stringify(data));
                this.setState({status: data.message});
            }
        }).catch(err=> {
            this.setState({status: err});
        }); 

    }
    hideNameEmail(){ 
        // if(document.getElementById('nameAndEmail').style.display = 'block'){
        //     document.getElementById('nameAndEmail').style.display = 'none';
        // }else if(document.getElementById('nameAndEmail').style.display = 'none'){
        //     document.getElementById('nameAndEmail').style.display = 'block '
        // }
        // document.getElementById('nameAndEmail').style.display = 'toggle'
        // var x = document.getElementById("nameAndEmail");
        // if (x.style.display === "none") {
        //     x.style.display = "block";
        // } else {
        //     x.style.display = "none";
        // }
    }
    componentDidMount(){
        
        if(document.getElementById('sidebarToggle').style.display='none'){
            document.getElementById('sidebarToggle').style.display='block';
        }
        this.getCompany()
    }
    render(){
        if(!sessionStorage.getItem('u_token')){
            window.location.href='/';
        }
        return (
            <header className="main-header">
                
                <nav style={navbar} className="navbar navbar-static-top">
                    
                    <a style={navbar} id="sidebarToggle" onClick={this.hideNameEmail} href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span className="sr-only">Toggle navigation</span>
                    </a>
                    
                    <div className="navbar-header">     
                        
                        <a href="#" className="navbar-brand" ><span id="assessment1" style={navbarBrand1}>{this.state.companyName}</span>
                        {/* <span id="assessment2" style={navbarBrand2}>Assessments</span> */}
                        </a>
                        
                    </div>
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">           
                            <li>
                                <span><img className="logo-mini" id="uassessLogoHeader" style={logo} src={this.state.logo}></img> </span>                            
                            </li>
                            
                            
                        </ul>
                    </div>
                </nav>
            </header>
        )
    }
}