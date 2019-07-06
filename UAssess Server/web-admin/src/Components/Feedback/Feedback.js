import React from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import './Feedback.css';
import validator from 'validator';
import { Container, Row, Col ,Input,Form,FormGroup,Label,Button} from 'reactstrap';
import { apiRoot } from "../../config";

const $ = window.$;

class Feedback extends React.Component {
    constructor(props){
     
        super(props);
       
        this.state = {
          feedbackname :'',
          feedbackemail:'',
          feedbacksubject:'',
          feedbackmessage: '',
          status:''
          
        }
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(event) {
        event.preventDefault();
        this.setState({status: ''});
        this.setState({
          [event.target.name]: event.target.value,
        });
    }
    canBeSubmitted() {
        const { feedbackemail} = this.state;
        return validator.isEmail(feedbackemail);
      }
    componentDidMount(){
      
        //document.getElementById('assessment1').innerHTML=" Submit Request";
        //document.getElementById('assessment2').innerHTML=" Submit Request";

        let removeActiveClass = document.querySelector(".activeMenu");
        removeActiveClass.classList.remove("activeMenu");
        let setActiveClass = document.querySelector('.feedbackMenu');
        setActiveClass.classList.add('activeMenu');
    }
    handleFormSubmit(e) {
        e.preventDefault();
            let data = JSON.stringify({
              "token":sessionStorage.getItem('u_token'),
              "name":this.state.feedbackname,
              "email":this.state.feedbackemail,          
              "subject":this.state.feedbacksubject,
              "message":this.state.feedbackmessage
            });
            fetch(apiRoot+'3000/api/send-feedback', {
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
                  this.setState({feedbackname:''});
                  this.setState({feedbackemail: ''});
                  this.setState({feedbacksubject: ''});
                  this.setState({feedbackmessage: ''});  
                  this.setState({status: data.message});                                                          
              }          
            else{
              this.setState({status: data.message});
            }
          }).catch((err)=>console.log(err))
        
      }
    render() {
        const isEnabled = this.canBeSubmitted();
        
        return(
            <Router>
                
                <div className="content-wrapper" id="feedbackWrapper">
                <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="no-padding-right">
                  <Row>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <h2>
                            Tell us how to improve UAssess
                        </h2>
                        <p className="login-container__form-status">{this.state.status}</p>
                      </Col>
                    </Row>
                    <Form>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="col--no-padding">
                          <FormGroup>
                              <Label for="Name">Name</Label>
                              <Row>
                                <Col className="no-padding-left" xs={12} sm={12} md={8} lg={6} xl={6}>
                                  <Input xs={6} sm={6} md={6} lg={6} xl={6} type="text" onChange={this.handleInputChange}onChange={this.handleInputChange} value={this.state.feedbackname} name="feedbackname" id="feedback-name" placeholder="Enter Your Name"/>
                                </Col>
                              </Row>
                          </FormGroup> 
                      </Col>
                    </Row> 
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="col--no-padding">
                          <FormGroup>
                              <Label for="Email">Email</Label>
                              <Row>
                                <Col className="no-padding-left" xs={12} sm={12} md={8} lg={6} xl={6}>
                                  <Input xs={6} sm={6} md={6} lg={6} xl={6} type="email" onChange={this.handleInputChange} value={this.state.feedbackemail}   name="feedbackemail" id="feedback-email" placeholder=" Enter Your EmailId"/>
                                </Col>
                              </Row>
                          </FormGroup>
                          </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="col--no-padding">    
                          <FormGroup>
                              <Label for="subject">Subject</Label>
                              <Row>
                                <Col className="no-padding-left" xs={12} sm={12} md={8} lg={6} xl={6}>
                                  <Input xs={6} sm={6} md={6} lg={6} xl={6} type="text" onChange={this.handleInputChange} value={this.state.feedbacksubject}  name="feedbacksubject" id="feedback-subject" placeholder="Enter the Subject"/>
                                </Col>
                              </Row>
                          </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="col--no-padding">  
                          <FormGroup>
                                <Label for="message">Message</Label>
                                <Row>
                                  <Col className="no-padding-left" xs={12} sm={12} md={8} lg={6} xl={6}>
                                    <Input xs={6} sm={6} md={6} lg={6} xl={6} type="textarea" onChange={this.handleInputChange} value={this.state.feedbackmessage} name="feedbackmessage" id="feedback-message" placeholder="Enter Message" />
                                  </Col>
                                </Row>
                          </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="col--no-padding">
                          <FormGroup>
                                <Button onClick={this.handleFormSubmit} className="feed-back-btn" size="lg" color="success"> Submit</Button>
                          </FormGroup>
                        </Col>
                    </Row>  
                    </Form>
                      
                  </Col>
                </Row>
                </div>
            </Router>
        );
    }
}
export default Feedback;