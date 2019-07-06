import React, { Component } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import { apiRoot} from '../../config.js'
import {
    Col,Row,Button,Input
} from 'reactstrap';
import './Assessment.css';
import GetTest from './GetTest';
import Link from 'react-router-dom/Link';

const $ = window.$;

class Assessment extends Component{
    constructor(props){
        super(props);
       
        this.state = {            
            status :'' ,
            allAssessments :'',
            completedAssess : '' ,
            
            key:'',
            keyStatus:'',
            searchValue:'',
            filteredAssessments:'',
            companyLogo:'',
            pauseIcon:''
        }
        // this.toggle = this.toggle.bind(this);

        this.handleInputChange123 = this.handleInputChange123.bind(this);

        this.clearAssessmentDetails=this.clearAssessmentDetails.bind(this);
        
        
        this.getMyAssessments = this.getMyAssessments.bind(this);

        this.stopCarret = this.stopCarret.bind(this);
        this.setCaretPosition = this.setCaretPosition.bind(this);

        this.assessmentSummary = this.assessmentSummary.bind(this);
        this.startAssessments = this.startAssessments.bind(this);
    }
    
    
    setCaretPosition(elem, caretPos) {
        if(elem != null) {
            if(elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
            }
            else {
                if(elem.selectionStart) {
                    elem.focus();
                    elem.setSelectionRange(caretPos, caretPos);
                }
                else
                    elem.focus();
            }
        }
    }
    stopCarret() {
        let obj = document.getElementById('partitioned');
        if (obj.value.length > 5){
            this.setCaretPosition(obj, 5);
        }
    }
    
    assessmentSummary(title,l_key,noOfQuestions,description,assessmentId,completedAssessId){
        this.clearAssessmentDetails();
        
        window.location.href='/start/'+l_key;
    }
    startAssessments(title,l_key,noOfQuestions,description,status){ 
        this.clearAssessmentDetails();         
        sessionStorage.setItem('a_title',title);
        window.location.href='/start/'+l_key;
        // if(status ==="pending"){
        //     window.location.href='/survey/'+l_key+'/'+noOfQuestions;
        // }
        
    }
    
    handleInputChange123(event) {
        event.preventDefault();
        // this.setState({status: ''});
        this.setState({
          searchValue: event.target.value,
        });
        this.getMyAssessments();
    }
    getMyAssessments(){     
        let data = JSON.stringify({
            "token":sessionStorage.getItem('u_token'),//"1-2-3",
        });
        fetch(apiRoot+'3003/api/get-my-assessments', {
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
                if(data.data.length!==0){
                var strings = ["Product" , "management" , "Assessment"];
                var searchVal = this.state.searchValue;
                var filtered =data.data.filter(function(str){
                    return str['title'].toLowerCase().includes(searchVal.toLowerCase());
                });
                this.setState({ filteredAssessments: filtered });
                
                
                let assessments=filtered.map((response,index)=>{ 
                    this.setState({key:response['licenseKey']}); 
                    let ts=response['createdAt'];
                    let date = new Date(response['createdAt']);
                    let eDate = new Date(response['expiryDate']);
                    let exDate = ('0' + eDate.getDate()).slice(-2) + '-' + ('0' + (eDate.getMonth()+1)).slice(-2) + '-' + eDate.getFullYear();
                    // let exDate =eDate.getDate()+'-' + (eDate.getMonth()+1) + '-'+eDate.getFullYear();
                    let sDate=date.getDate()+'-' + (date.getMonth()+1) + '-'+date.getFullYear();
                    if(response['companyLogo']){
                        this.setState({companyLogo:response['companyLogo']})
                    }else{
                        this.setState({companyLogo:'pl-logo.png'})
                    }
                    if(response['status']==='pending'){
                        this.setState({pauseIcon:<span className='icon-border'><i className="fa fa-pause-circle" aria-hidden="true"></i></span>})
                    }else{
                        this.setState({pauseIcon:''})
                    }
                    // if(response['status'] =='pending'){
                        
                        return( 
                           <Link to={'/start/'+response['licenseKey']} key={response['id']} > <Col xs={12} sm={12} md={6} lg={4} xl={4} >
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="box-shadow white-bg cursor-pointer" >
                                    <Row className="box-header-row">
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                            {this.state.pauseIcon}
                                            <img className="box-header-company-logo" src={this.state.companyLogo}/>
                                        </Col>
                                        <Col xs={9} sm={9} md={9} lg={9} xl={9}>
                                            <h4 className="box-header-title">{response['title']}</h4>
                                            <p className="box-header-col">Expire On : <span className="box-header-expiry-date">{exDate}</span></p>
                                        </Col>
                                    </Row>
                                    <hr className="section-divider"/>
                                    <Row className='box-footer-row'>
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                            <p className="box-footer-col"><i className="fa fa-clock-o"></i> {response['duration']} Minutes</p>
                                        </Col>
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                            <p className="box-footer-col"><i className="fa fa-outdent"></i> {response['noOfQuestions']} Questions</p>
                                        </Col>
                                    </Row>                                 
                                </Col>
                            </Col>
                            </Link>
                        );
                    // }                                                    
                });
                this.setState({allAssessments:assessments});
            }else{
                this.setState({allAssessments:<div className="text-center"><br/><br/><h4>Assessments are Empty</h4></div>});
            }
            }else{
                
            }
        }).catch(err=> {
            this.setState({status: err});
        }); 
    }
    componentDidMount(){
        // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        //     $('[data-toggle="push-menu"]').pushMenu('toggle');
        // }
        this.getMyAssessments()
        document.getElementById('assessment1').innerHTML="Assessments";
        document.getElementById('assessment2').innerHTML="Assessments ";
       
    } 
    
    clearAssessmentDetails(){
        this.setState({key:''});
        this.setState({keyStatus:''});
        document.getElementById('keyErrormessege').innerHTML='';
        $('#getTestDiv').modal('show');
        // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        //     if($('.main-sidebar').is(':visible')) {
        //         $('[data-toggle="push-menu"]').pushMenu('toggle');
        //     } 
        //   }
        document.getElementById('partitioned').value='';
        if(sessionStorage.getItem('licenseKey')) sessionStorage.removeItem('licenseKey');
        if(sessionStorage.getItem('a_title'))sessionStorage.removeItem('a_title');
        if(sessionStorage.getItem('a_noOfQuestions')) sessionStorage.removeItem('a_noOfQuestions');
        if(sessionStorage.getItem('questionId')) sessionStorage.removeItem('questionId');
        if(sessionStorage.getItem('a_description')) sessionStorage.removeItem('a_description');
        if(sessionStorage.getItem('data')) sessionStorage.removeItem('data');
        if(sessionStorage.getItem('assessmentId')) sessionStorage.removeItem('assessmentId');
        if(sessionStorage.getItem('completedAssessId')) sessionStorage.removeItem('completedAssessId');
    }
    
    render() {
        if(!sessionStorage.getItem('u_token')){
            window.location.href="/"
        }
        
        return (
                <div className="content-wrapper">            
                    <Row id="tabRow">
                          
                        <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                            <form role="search">
                                {/* <Col xs={12} sm={12} md={12} lg={12} xl={12} className="input-group"> */}
                                    <Input xs={12} sm={12} md={12} lg={12} xl={12} type="text" name='searchValue' onChange={this.handleInputChange123} id="searchAssessments" className="form-control" value={this.state.searchValue} placeholder="Search Assessments by Name" />
                                {/* </Col> */}
                            </form>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                            <GetTest/>
                            <Button xs={12} sm={12} md={12} lg={12} xl={12} size="lg" block onClick={this.clearAssessmentDetails}  id="getTest" color="success">Get Assessment</Button>                    
                        </Col>
                        
                    </Row>
                    <br/>
                    <Row id="tabRow">
                        <br/>
                        {/* <Col xs={12} sm={12} md={12} lg={12} xl={12}> */}
                            {this.state.allAssessments}
                            
                        {/* </Col> */}
                        
                    </Row>
                       
                </div>
                
                
            
        )
    }

}
export default Assessment;