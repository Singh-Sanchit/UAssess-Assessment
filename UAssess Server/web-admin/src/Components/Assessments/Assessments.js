import React, { Component } from 'react';
import { apiRoot} from '../../config.js'
import { Col,Row,Input } from 'reactstrap';
import './Assessment.css';
import Link from 'react-router-dom/Link';

const $ = window.$;

class Assessment extends Component{
    constructor(props){
        super(props);
       
        this.state = {            
            status :'' ,
            allAssessments :<div className="text-center loading-icon-ass"><i className="fa fa-refresh fa-spin" aria-hidden="true"></i></div>,
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
            "companyId":sessionStorage.getItem('u_companyId')//"1234"           
        });
        fetch(apiRoot+'3003/api/get-assessments', {
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
                this.setState({totalAssessments:data.totalAssessments})
                this.setState({ ongoingAssessments: data.ongoingAssessments });
                this.setState({ totalAssessee: data.totalAssessee });

                if(data.data.length!==0){
                    var searchVal = this.state.searchValue;
                    var filtered =data.data.filter(function(str){
                    return str['title'].toLowerCase().includes(searchVal.toLowerCase());
                });
                this.setState({ filteredAssessments: filtered });
                

                var part=0;
                let assessments=filtered.map((response,index)=>{ 
                    this.setState({key:response['licenseKey']}); 
                    let eDate = new Date(response['expiryDate']);
                    let exDate = ('0' + eDate.getDate()).slice(-2) + '-' + ('0' + (eDate.getMonth()+1)).slice(-2) + '-' + eDate.getFullYear();
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
                        part++;
                        return( 
                           <Link to={'/reports/'+response['licenseKey']} key={response['id']} data-toggle="tooltip" data-placement="top" title={response['title']} > <Col xs={12} sm={12} md={6} lg={4} xl={4} >
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="box-shadow white-bg cursor-pointer" >
                                    <Row className="box-header-row">
                                        {/* <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                            {this.state.pauseIcon}
                                            <img className="box-header-company-logo" src={this.state.companyLogo}/>
                                        </Col> */}
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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
                setTimeout(e=>  {
                    this.setState({allAssessments:assessments});
                }, 1000);
            }else{
                setTimeout(e=>  {
                    this.setState({allAssessments:<div className="text-center"><br/><br/><h4>Assessments are Empty</h4></div>});
                }, 1000);
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
        $('[data-toggle="tooltip"]').tooltip();
        this.getMyAssessments()
        //document.getElementById('assessment1').innerHTML="Assessments";
        //document.getElementById('assessment2').innerHTML="Assessments ";
        let removeActiveClass = document.querySelector(".activeMenu");
        removeActiveClass.classList.remove("activeMenu");
        let setActiveClass = document.querySelector('.assessmentMenu');
        setActiveClass.classList.add('activeMenu');
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
        // <Router>
                <div className="content-wrapper">   
                
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="cursor-pointer info-tags" >
                        <Row className="box-header-row">
                        <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                            <div className="small-box bg-pink">
                            <div className="inner">
                                <h3>{this.state.totalAssessments}</h3>
                                <p>Total Assessments</p>
                            </div>
                            <div className="icon">
                                <i className="fa fa-bar-chart info-tags-fa-size"></i>
                            </div>
                            </div>
                        </Col>  
                        <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                            <div className="small-box bg-green">
                            <div className="inner">
                                <h3>{this.state.ongoingAssessments}</h3>
                                <p>Ongoing Assessments</p>
                            </div>
                            <div className="icon">
                                <i className="fa fa-bar-chart info-tags-fa-size"></i>
                            </div>
                            </div>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                            <div className="small-box bg-yellow">
                            <div className="inner">
                                <h3>{this.state.totalAssessee}</h3>
                                <p>Number of Assessee</p>
                            </div>
                            <div className="icon">
                                <i className="fa fa-bar-chart info-tags-fa-size"></i>
                            </div>
                            {/* <a href="#" className="small-box-footer">More info <i className="fa fa-arrow-circle-right"></i></a> */}
                            </div>
                        </Col> 
                        </Row>
                    </Col>       
                    <Row id="tabRow">
                          
                        <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                            <form role="search">
                                {/* <Col xs={12} sm={12} md={12} lg={12} xl={12} className="input-group"> */}
                                    <Input xs={12} sm={12} md={12} lg={12} xl={12} type="text" name='searchValue' onChange={this.handleInputChange123} id="searchAssessments" className="form-control" value={this.state.searchValue} placeholder="Search Assessments by Name" />
                                {/* </Col> */}
                            </form>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                        <Link to={"/create"}><button xs={12} sm={12} md={12} lg={12} xl={12} id="createAssessmentBut" type="button">Create Assessment</button> </Link>                   
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
                
                
            
        // </Router>
        )
    }

}
export default Assessment;