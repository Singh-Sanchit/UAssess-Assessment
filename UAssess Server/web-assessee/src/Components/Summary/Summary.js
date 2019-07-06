import React from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import './Summary.css'
import GetTest from "../Assessments/GetTest";
import {
    Col,Row
} from 'reactstrap';
import { apiRoot } from "../../config";



const $ = window.$;
class Summary extends React.Component {
    
    constructor(props) {
            super(props);
            this.state={
                score:'',
                title:'',
                skill:'',
                description:'',
                reportId:'',
                reportGeneration:'',
                assessmentTitle:'',
                summary:'',
                thanksMsg:''
            }    
    }

    componentDidMount(){
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $('[data-toggle="push-menu"]').pushMenu('toggle');
        }
        let data = JSON.stringify({
            "token":sessionStorage.getItem('u_token'),//"1-2-3",
            "reportId":this.props.match.params.reportId
        });
        fetch(apiRoot+'3003/api/get-user-summary', {
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
                if(data.data.avgScore){
                    this.setState({score:data.data.avgScore})
                }else{
                    this.setState({score:"-"})
                }
                
                this.setState({reportId:data.data.id})
                if(data.data.title){
                    this.setState({assessmentTitle:data.data.title+" Summary"})
                }else{
                    this.setState({assessmentTitle:"Assessment"})
                }
                
                if(data.data.reportGeneration===true){
                    this.setState({reportGeneration:<a id='viewReport' href={apiRoot+"3003/api/download-report/"+this.state.reportId} ><i className="fa fa-download padding-right-1rem "></i> Download Report </a>})
                }else{
                    this.setState({reportGeneration: <a style={{color:'grey',fontSize:'2.5rem'}}><i className="fa fa-download padding-right-1rem"></i> Download Report </a> });
                }
                if(data.data.axisScore){
                    let skills=data.data.axisScore.skills.map((response,index)=>{ 
                        return(
                            <Row className="text-font-size" key={response['id']}>
                                <Col className="skills-label" xs={8} sm={8} md={8} lg={8} xl={8}>
                                    <h4>{response['label']}</h4>
                                </Col>
                                <Col className="skills-score" xs={2} sm={2} md={2} lg={2} xl={2}>
                                    <h4>{Math.round(response['score'] * 10) / 10}</h4>
                                </Col> 
                            </Row>
                        )
                        
                    });
                    this.setState({skill:skills})
                }else{
                    this.setState({skill:"Skills are Empty"})
                }
                this.setState({mixed:"mixed"});
                // data.data.assessmentType
                if((data.data.reportGeneration===false && data.data.displayReportToUser===false) ){
                    this.setState({summary :
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className='thanks-success text-center padding-rem-3'>
                            <Row>   
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <h3 className="no-margin"><b>Thanks for Taking Test</b></h3>
                                </Col>
                            </Row>
                        </Col>
                    })
                }else{
                    console.log("dasdsafaf");
                    this.setState({summary:
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className='grey-border-radius white-bg summary-padding-bottom'>
                            <Row>
                                <div className="no-margin">
                                    <div className="col-lg-4"></div>
                                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 block">
                                        <div className="circle-score">
                                            <h3> YOUR SCORE </h3>
                                            <h4><b>{this.state.score}</b></h4>
                                        </div>
                                    </div>
                                    <div className="col-lg-4"></div>
                                </div>
                            </Row>
                            <hr className="section-dividerd"></hr>

                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                                    {this.state.reportGeneration}   
                                </Col>
                            </Row>

                            <hr className="section-dividerd"></hr>


                            <Row className="text-font-size"> 
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <h3>Summary</h3>
                                </Col>
                            </Row>
                            {this.state.skill}
                        </Col>
                    
                    })
                }
            }else{
               alert(data.message); 
            }
        }).catch(err=> {
            this.setState({status: err});
        });
        
    }
    render() {
        return(
            <Router>
                <div className='content-wrapper'>
                    <Row className="no-margin">
                        <Col>
                            <h2 className="text-center summary-title">{this.state.assessmentTitle}</h2>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="padding-summary">
                                {this.state.summary}
                                    
                            </Col>  
                        </Col>
                    </Row>

                <GetTest/>
                
                </div>
            </Router>
    
        );
    
    }
    
}
export default Summary;
