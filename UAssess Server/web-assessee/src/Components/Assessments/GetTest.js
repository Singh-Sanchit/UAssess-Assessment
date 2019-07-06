import React from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import {
    Col,Row,Label,Form,FormGroup,Input,Button
} from 'reactstrap';
import './Assessment.css';
import { apiRoot } from "../../config";
const $ = window.$;
class GetTest extends React.Component {
    constructor(props){
        super(props);
       
        this.state = {            
            modal: false,
            key:'',
            keyStatus:''
        }
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        // this.toggle = this.toggle.bind(this);
    }
    handleInputChange(event) {
        event.preventDefault();
        //this.setState({status: ''});
        this.setState({
          [event.target.name]: event.target.value,
        });
        this.setState({keyStatus:''})
    }
    canBeSubmitted() {
        const { key } = this.state;
        return key.length == 6;
    }
    componentDidMount(){
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $('[data-toggle="push-menu"]').pushMenu('toggle');
        }
        //  $("aside").toggle();
        // $(".sidebar-toggle").controlSidebar(options);
        
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
                window.location.href="/assessments";
                // window.location.href='/survey/'+this.state.key+'/'+data.data.noOfQuestions+'/'+data.data.data.id;

            }else{
                
                this.setState({keyStatus:data.message});
                this.setState({key:''})
                              
            }
        }).catch(err=> {
            alert(err);
        }); 

    }
    render() {
        const isEnabled = this.canBeSubmitted();
        return(
            <div className="modal fade in" id="getTestDiv" >
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
        );
    }
}
export default GetTest;