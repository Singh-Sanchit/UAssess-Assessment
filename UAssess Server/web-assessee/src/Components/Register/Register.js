import React from 'react';
// import './Register.css';
import {
    Col,Row,Label,Form,FormGroup,Input,Button
} from 'reactstrap';
import validator from 'validator';
import {Redirect,BrowserRouter as Router} from 'react-router-dom';
import { apiRoot } from '../../config';

class Register extends React.Component {

  constructor(props){
    super(props);
   
    this.state = {
      name:'',
      email:'',
      password:'',
      status:'',
      redirect: false,
      confirmPassword:''
    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckPassword = this.handleCheckPassword.bind(this);
    this.getAssessmentOneQuestion = this.getAssessmentOneQuestion.bind(this);
  }

  handleInputChange(event) {
    event.preventDefault();
    
    this.setState({
      [event.target.name]: event.target.value,
    });
    
    this.setState({status: ''});
  }
  handleCheckPassword(event){
    // event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
    if(this.state.password != event.target.value){
      this.setState({status: 'Password Not Match'});
    }else{
      this.setState({status: ''});
    }
  }
  formStatus(value){
    return value ? null :"please provide the corrects details";
}
setRedirect = () => {
  this.setState({
    redirect: true
  })
}
getAssessmentOneQuestion(param){
    fetch(apiRoot+'3003/api/get-assessment-one-question', {
        method: 'POST',
        body: param,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json();
    }).then(data =>{
        let token = sessionStorage.getItem('u_token');
        let key = sessionStorage.getItem('licenseKey');
        if(data.code === "0")
        {                                       
            let noOfQuestions=data.data.noOfQuestions;
            let questionId =data.data.data.id;
            sessionStorage.setItem('a_title',data.data.title);
            window.location.href="/assessments";
        }
        
    }).catch(err=> {
        alert(err);
    });
}

  handleFormSubmit(e) {
    e.preventDefault();
    if(validator.isEmail(this.state.email) && this.state.password){
        let data = JSON.stringify({
            "name":this.state.name,
            "privilegeRole":"Assessee",
            "email":this.state.email,
            "password":this.state.password,
            "pushNotificationId":sessionStorage.getItem('pushNotificationId')
        });
        fetch(apiRoot+'3000/api/register', {
          method: 'POST',
          dataType: 'jsonp',
          headers : {
            'Content-Type': 'application/json'
        },
        body:data
        }).then((res) => res.json())
        .then(data => {
        if(data.code === "0")
        {
          sessionStorage.setItem('isLoggedIn','true');
          sessionStorage.setItem('u_token', data.data.token);
          sessionStorage.setItem('u_name', data.data.name);
          sessionStorage.setItem('u_email', data.data.email); 

          if(sessionStorage.getItem('licenseKey')) {
            let data=JSON.stringify({
                "licenseKey": sessionStorage.getItem('licenseKey'),
                "token":sessionStorage.getItem('u_token')            
            });
            return this.getAssessmentOneQuestion(data);
          }else {
            window.location.href='/assessments';
          }
           
        }else{
            this.setState({status: data.message});
        }
        }).catch((err)=>console.log(err))
    } else{ 
    }    
    
}

  canBeSubmitted() {
    const {name,email, password ,confirmPassword} = this.state;
      
    return validator.isEmail(email) && password.length >= 4 && password===confirmPassword ;
  }
  
 
  render() {
    const isEnabled = this.canBeSubmitted();     
    
     return (<Router> 
           
      <div className="login-container ">        
        <div className="login-container__form-container">
        <p className="login-container__form-status">{this.state.status}</p>
          <Form >
          <Row  className="row--no-margin">
              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="col--no-padding">
                  <FormGroup  >
                    <Label className="login-container__form-label " for="name" sm={12}>Name</Label>
                      <Input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={this.state.name}
                        placeholder="Enter Your Name"
                        onChange={this.handleInputChange}
                        required 
                          />                 
                  </FormGroup>
                  
              </Col>
            </Row>
            
            <Row  className="row--no-margin">
              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="col--no-padding">
                  <FormGroup  >
                    <Label className="login-container__form-label " for="loginEmail" sm={12}>Email</Label>
                      <Input 
                        type="email" 
                        name="email" 
                        id="loginEmail" 
                        value={this.state.email}
                        placeholder="Enter Email Id"
                        onChange={this.handleInputChange}
                        required 
                          />                 
                  </FormGroup>
                  
              </Col>
            </Row>
            <Row  className="row--no-margin">
              <Col  xs={12} sm={12} md={12} lg={12} xl={12}className="col--no-padding">
                <FormGroup  >
                  <Label className="login-container__form-label " for="loginPassword" sm={12}>Password</Label>
                    <Input xs={12}
                      type="password" 
                      name="password" 
                      id="loginPassword"
                      value={this.state.password} 
                      placeholder="Enter the password"
                      onChange={this.handleInputChange}
                      required
                      minLength={4}
                      /> 
                  </FormGroup>
              </Col>
            </Row>
            <Row  className="row--no-margin">
              <Col  xs={12} sm={12} md={12} lg={12} xl={12}className="col--no-padding">
                <FormGroup  >
                  <Label className="login-container__form-label " for="loginPassword" sm={12}>Confirm Password</Label>
                    <Input xs={12}
                      type="password" 
                      name="confirmPassword" 
                      id="loginPassword"
                      value={this.state.confirmPassword} 
                      placeholder="Confirm password"
                      onChange={this.handleCheckPassword}
                      required
                      minLength={4}
                      /> 
                  </FormGroup>
              </Col>
            </Row>
            <Row >
              <Col  xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormGroup>
                  <Button id="btnSubmit" 
                    className="login-container__button "
                    onClick={this.handleFormSubmit}
                    type="submit"
                    disabled={!isEnabled}
                  >Sign Up
                  </Button>
                               
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} xl={6}><a className="login-container__create-acc" href="/"><span>Login</span></a></Col>
            </Row>
            {/* <a href="/"><b>Login</b></a>   */}
          </Form>
          
        </div>
      </div>
      </Router>     
    );  
   
  }
}
export default Register;