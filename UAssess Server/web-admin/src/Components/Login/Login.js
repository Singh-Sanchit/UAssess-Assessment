import React from 'react';
import {Col,Row,Label,Form,FormGroup,Input,Button } from 'reactstrap';
import validator from 'validator';
import {BrowserRouter as Router} from 'react-router-dom';
import { apiRoot } from '../../config';
import './LoginAdmin.css';

class CompanyLogin extends React.Component {

  constructor(props){
    super(props);
   
    this.state = {
      email:'',
      password:'',
      status:'',
      redirect: false,
      
    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this); 
    this.getAssessmentOneQuestion = this.getAssessmentOneQuestion.bind(this);   
    // sessionStorage.clear();
    if(this.props.match.params.id){
      sessionStorage.setItem('licenseKey', this.props.match.params.id);       
    }
    if(sessionStorage.getItem("u_token")){
        window.location.href='/assessments';
    }
  }
  
  handleInputChange(event) {
    event.preventDefault();
    this.setState({status: ''});
    this.setState({
      [event.target.name]: event.target.value,
    });
    
    
    
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
    
    if(validator.isEmail(this.state.email) && this.state.password && this.state.dropDownValue!== 'Select Role'){
        //if(this.state.dropDownValue === 'Select Role'){
        let data = JSON.stringify({
          "authType":"Default",
          "clientId":"web",
          "userId":this.state.email,          
          "password":this.state.password,
          "pushNotificationId":sessionStorage.getItem('pushNotificationId')
        });
        fetch(apiRoot+'3000/api/login', {
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
              var array = data.data.privilegeRoles
              if(array.indexOf("CompanyAdmin") !== -1){
                    sessionStorage.setItem('isLoggedIn','true');
                    sessionStorage.setItem('u_token', data.data.token);
                    //sessionStorage.setItem('u_email', data.data.email);
                    sessionStorage.setItem('u_companyId', data.data.companyId);
                    sessionStorage.setItem('role', 'CompanyAdmin'); 
                    if(data.data.profileImage!==""){
                      sessionStorage.setItem('u_profileImage', data.data.profileImage);
                    }
                    window.location.href ="/assessments" ;             
              }else{
                this.setState({status: "Role MisMatch"});                                      
          }          
        }else{
          this.setState({status: data.message});
        }
      }).catch((err)=>console.log(err))
    
    } else{
      this.setState({status: "All the Fields are required"});
    }
  }

  canBeSubmitted() {
    const { email, password } = this.state;
    return validator.isEmail(email) && password.length >= 4;
  }
  
 
  render() {
    const isEnabled = this.canBeSubmitted();
    
     return (<Router> 
           
      <div className="login-container">
      <div>
        <h3 className="login-title text-center">UASSESS
        {/* <img className="logo" src="../../../Uassess-Logo.png"></img> */}
        </h3>
        {/* <h3 className="login-title"><img className="logo" src="../../../Uassess-Logo.png"></img></h3> */}
        <div className="login-container__form-container">
        <div className="singin-title">Company Admin</div>
        <p className="login-container__form-status">{this.state.status}</p>
          <Form >
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
            <Row >
              <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormGroup  >
                  <Button id="btnSubmit"  
                    className="login-container__button"
                    onClick={this.handleFormSubmit}
                    type="submit"
                    disabled={!isEnabled}
                  >Sign In
                  </Button>
                  </FormGroup>               
              </Col>
            </Row>              
          </Form>
          </div>
        </div>
      </div>
      </Router>     
    );   
  }
}
export default CompanyLogin;