import React, { Component } from 'react';
import { apiRoot} from '../../config.js'
import { Col,Row,Button} from 'reactstrap';
import './Assessment.css';
import Link from 'react-router-dom/Link';
import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';
import ProgressBar from './ProgressBar.js';

class CreateAssessment extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            status :'' ,
            allAssessments :<div className="text-center loading-icon"><i className="fa fa-refresh fa-spin" aria-hidden="true"></i></div>,
            filteredAssessments:'',
            templates:<div className="text-center loading-icon"><i className="fa fa-refresh fa-spin" aria-hidden="true"></i></div>
            
        };
    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
    }
    componentDidMount(){
        this.getAssessments();
        this.getTemplates();
        let removeActiveClass = document.querySelector(".activeMenu");
        removeActiveClass.classList.remove("activeMenu");
        let setActiveClass = document.querySelector('.createAssessmentMenu');

        setActiveClass.classList.add('activeMenu');
    }
    getTemplates(){
        let data = JSON.stringify({
            "token":sessionStorage.getItem('u_token'),//"1-2-3",
            "active":true          
        }); 
        fetch(apiRoot+'3001/api/get-template-roles', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => { 
            return res.json();
        }).then(data =>{            
            if(data.code === "0"){ 
                if(data.data.length!==0){
                    let template=data.data.map((response,index)=>{ 
                    
                            return( 
                            <Link to={'/template/'+response['id']} key={response['id']} > <Col xs={12} sm={12} md={6} lg={4} xl={4} >
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="box-shadow cursor-pointer grey-bg bg-image" >
                                        <img id="templateImg" src="/images/template-bg.jpg" />
                                        <Row className="header-row text-right"> 
                                                                               
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12}  className="box-header-title-tem">
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <h4><b>{response['label']}</b></h4>
                                                </Col>
                                            </Col>
                                        </Row>
                                                                        
                                    </Col>
                                </Col>
                                </Link>
                            );
                        // }                                                    
                    });
                    setTimeout(e=>  {
                        this.setState({templates:template});
                    }, 1000);
                }else{
                    setTimeout(e=>  {
                        this.setState({templates:<div className="text-center"><br/><br/><h4>Templates are Empty</h4></div>});
                    }, 1000); 
                }
                
            }else{
                alert(data.message)
            }
        }).catch(err=> {
            this.setState({status: err});
        }); 

    }
    getAssessments(){             
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
               
                if(data.data.length!==0){
                            
                let assessments=data.data.map((response,index)=>{ 
                    this.setState({key:response['licenseKey']}); 
                   
                        return( 
                           <Link to={'/form/'+response['licenseKey']} key={response['id']} > <Col xs={12} sm={12} md={6} lg={4} xl={4} >
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="box-shadow cursor-pointer grey-bg" >
                                    <Row className="box-header-row">                                        
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <h4 className="box-header-title">{response['title']}</h4>
                                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                                <p className="box-header-col"><span>{response['assessmentType']}</span></p>
                                            </Col>
                                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                                <Button color="primary" className="use-btn">Use</Button>
                                            </Col>
                                        </Col>
                                    </Row>
                                    <hr className="section-divider"/>
                                    <Row className='box-footer-row'>                                    
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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
                alert(data.message);
            }
        }).catch(err=> {
            this.setState({status: err});
        }); 
    }
    render() {
        return (
                <div className="content-wrapper">
                    <ProgressBar activeStep={-1} />
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="padding--3"> 
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="white-bg-grey-border nav-tabs-custom">
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                        className={classnames({ active: this.state.activeTab === '1' })}
                                        onClick={() => { this.toggle('1'); }}
                                        >
                                        <h3>Copy Existing </h3>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                        className={classnames({ active: this.state.activeTab === '2' })}
                                        onClick={() => { this.toggle('2'); }}
                                        >
                                        <h3>Choose from templates</h3>
                                        </NavLink>
                                    </NavItem>                                
                                </Nav>
                                <Row>
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6} className="text-center padding-top-3rem">
                                        {/* <Link to='#'><i className="fa fa-filter"></i></Link> */}
                                    </Col>
                                </Row>
                                <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="1">
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="no-padding-left-right">
                                                {this.state.allAssessments}
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="no-padding-left-right">
                                                {this.state.templates}  
                                            </Col>
                                        </Row>
                                    </TabPane>
                                </TabContent>
                            </Col> 
                        </Col>
                    </Row>                    
                </div>
        )
    };
}
export default CreateAssessment;