import React from "react";
import {
    Col,Row,Label,Form,FormGroup,Input,Button
} from 'reactstrap';
import { Redirect } from 'react-router'
import GetTest from "../Assessments/GetTest";
import { apiRoot } from "../../config";

const $ = window.$;
class AlertBox extends React.Component {
    constructor(props){
        super(props);
       
        this.state = {            
            modal: false,
            assessment:"",
            profile:'',
            key:'',
            keyStatus:'',
        }
        
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        
        this.assessmentPage = this.assessmentPage.bind(this);
        this.profilePage = this.profilePage.bind(this);
        this.feedbackPage = this.feedbackPage.bind(this);
    }
    logout() {
        window.onbeforeunload =null;
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
                
                window.location.href = '/';
                
            } else {
                alert(data.message);
            }
        })
        .catch((err)=>console.log(err))
        
        
      }
    assessmentPage(e){
        e.preventDefault();
        this.setState({redirectAss: true});
        $('[data-toggle="push-menu"]').pushMenu('toggle');
        $('#alertBox-assessment').modal('hide');
        // this.props.history.push('/assessments')
        // window.location.href='/assessments';
    } 
    profilePage(e){
        e.preventDefault();
        this.setState({redirectPro: true});
        $('[data-toggle="push-menu"]').pushMenu('toggle');
        $('#alertBox-profile').modal('hide');
        // this.props.history.push("/profile")
        // window.location.href='/profile';
    }
    feedbackPage(e){
        // this.props.history.push("/feedback")
        // window.location.href='/feedback';
        e.preventDefault();
        this.setState({redirectFee: true});
        $('[data-toggle="push-menu"]').pushMenu('toggle');
        $('#alertBox-feedback').modal('hide');
    }
    getTestBox(){
        
            $('#alertBox-getTest').modal('hide');

            $('#getTestInTest').modal('show');
        
    }
    handleInputChange(event) {
        event.preventDefault();
        this.setState({
          [event.target.name]: event.target.value,
        });
        this.setState({keyStatus:''})
    }
    canBeSubmitted() {
        const { key } = this.state;
        return key.length == 6;
    }
    handleFormSubmit(e) {
        e.preventDefault();
        
        let data = JSON.stringify({
            "licenseKey":this.state.key ,
            "token":sessionStorage.getItem('u_token')            
        });
        fetch(apiRoot+'3003/api/get-assessment-one-question', {
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
                // this.props.history.push("/assessments");
                // window.location.href="/assessments";
                this.setState({redirectAss: true});


            }else{
                
                this.setState({keyStatus:data.message});
                this.setState({key:''})
                              
            }
        }).catch(err=> {
            alert(err);
        }); 

    }
    render() {
        if (this.state.redirectAss) {
            return (<Redirect to="/assessments" />);
        }else if(this.state.redirectPro){
            return (<Redirect to="/profile" />);
        }else if(this.state.redirectFee){
            return (<Redirect to="/feedback" />);
        }
        const isEnabled = this.canBeSubmitted();
        return(
            <div>
            <div className="modal fade in" id="alertBox-assessment" >
                <div className="modal-dialog">
                    <div className="modal-content">
                    
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <i className="fa fa-times-circle"></i>
                        {/* <span className="text-center" aria-hidden="true">×<br/></span> */}
                        </button>
                    </div>
                    
                    <div className="modal-body text-center">
                    {/* <img className="alert-icon" src="/alert-icon.png" /> */}
                        <i className="fa fa-exclamation-triangle"></i>
                        <h4>Do you want to exit the Assessment?</h4>   
                    </div>
                    <div className="modal-footer">                                
                        <Button size="lg" type="submit" onClick={this.assessmentPage}  color="primary">OK</Button>
                    </div>
                    <br/>
                    </div>
                </div>
            </div>

            <div className="modal fade in" id="alertBox-profile" >
                <div className="modal-dialog">
                    <div className="modal-content">
                    
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <i className="fa fa-times-circle"></i>
                        {/* <span className="text-center" aria-hidden="true">×<br/></span> */}
                        </button>
                    </div>
                    
                    <div className="modal-body text-center">
                    <i className="fa fa-exclamation-triangle"></i>
                        <h4>Do you want to exit the Assessment?</h4>   
                    </div>
                    <div className="modal-footer">                                
                        <Button size="lg" type="submit" onClick={this.profilePage} color="primary">OK</Button>
                    </div>
                    <br/>
                    </div>
                </div>
            </div>

            <div className="modal fade in" id="alertBox-feedback" >
                <div className="modal-dialog">
                    <div className="modal-content">
                    
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <i className="fa fa-times-circle"></i>
                        {/* <span className="text-center" aria-hidden="true">×<br/></span> */}
                        </button>
                    </div>
                    
                    <div className="modal-body text-center">
                    <i className="fa fa-exclamation-triangle"></i>
                        <h4>Do you want to exit the Assessment?</h4>   
                    </div>
                    <div className="modal-footer">                                
                        <Button size="lg" type="submit" onClick={this.feedbackPage} color="primary">OK</Button>
                    </div>
                    <br/>
                    </div>
                </div>
            </div>

            <div className="modal fade in" id="alertBox-signout" >
                <div className="modal-dialog">
                    <div className="modal-content">
                    
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <i className="fa fa-times-circle"></i>
                        {/* <span className="text-center" aria-hidden="true">×<br/></span> */}
                        </button>
                    </div>
                    
                    <div className="modal-body text-center">
                    <i className="fa fa-exclamation-triangle"></i>
                        <h4>Do you want to exit the Assessment?</h4>   
                    </div>
                    <div className="modal-footer">                                
                        <Button size="lg" type="submit" onClick={this.logout} color="primary">OK</Button>
                    </div>
                    <br/>
                    </div>
                </div>
            </div>

            <div className="modal fade in" id="alertBox-getTest" >
                <div className="modal-dialog">
                    <div className="modal-content">
                    
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal"  aria-label="Close">
                        <i className="fa fa-times-circle"></i>
                        {/* <span className="text-center" aria-hidden="true">×<br/></span> */}
                        </button>
                    </div>
                    
                    <div className="modal-body text-center">
                    <i className="fa fa-exclamation-triangle"></i>
                        <h4>Do you want to exit the Assessment?</h4>   
                    </div>
                    <GetTest />
                    <div className="modal-footer">   
                    {/* <a href="#getTestDiv" data-toggle="modal" data-dismiss="modal">Next ></a>                              */}
                        <Button size="lg" onClick={this.getTestBox} color="primary">OK</Button>
                    </div>
                    <br/>
                    </div>
                </div>
            </div>

            <div className="modal fade in" id="getTestInTest" >
                        <div className="modal-dialog">
                            <div className="modal-content">
                            
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <i className="fa fa-times-circle"></i>
                                {/* <span className="text-center" aria-hidden="true">×<br/></span> */}
                                </button>
                            </div>
                            
                            <div className="modal-body text-center">
                                <h1>Get Assessment</h1>
                                <p>Enter the 6 digit code to get the test</p>
                                <p className="login-container__form-status" id="keyErrormessege">{this.state.keyStatus}</p>
                                <Form >
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        
                                            <FormGroup  >                                        
                                                <div id="divOuter">
                                                    <div id="divInner">
                                                        <input value={this.state.key} name="key" id="partitioned" onChange={this.handleInputChange} type="text" maxLength="6" />
                                                    </div>
                                                </div>
                                                
                                            </FormGroup>                                    
                                        </Col>
                                    </Row>
                                </Form> 
                            </div>
                            <div className="modal-footer">                                
                                <Button size="lg" id="okBtn" type="submit" onClick={this.handleFormSubmit} disabled={!isEnabled} color="success">OK</Button>
                            </div>
                            <br/>
                            </div>
                        </div>
                    </div>

            </div>
        );
    }
}
export default AlertBox;