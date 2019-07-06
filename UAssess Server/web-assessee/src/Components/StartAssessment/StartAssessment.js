import React, { Component } from 'react';
import {BrowserRouter as Router,Redirect, Link} from 'react-router-dom';
import './StartAssessment.css';
import GetTest from '../Assessments/GetTest';
import { apiRoot } from '../../config';
import {
    Col,Row,Button,Input
} from 'reactstrap';

const startdiv={
    // border:'1px solid grey',
    
}
const contentDiv={
    padding:'5%'
}
const startAssessment={
    border:'1px solid grey',
    color:'grey',
    borderRadius:'20px',
    // width:'95%',
    background:'white',
    // paddingLeft:'7%',
    paddingTop:'2%'
}

const buttonDiv={
    paddingTop:'9%',
    paddingBottom:'5%',
    
}
const $ = window.$;


class StartAssessment extends Component{
    constructor(props){
        super(props);   
        this.state={
            summary:'',
            title:'',
            avgScore:'',
            noOfQuestions:'',
            header:'',
            licenseKey:'',
            downloadbtn:'',
            viewReport:'',
            description:'',
            duration:'',
            assessmentStatus:'',
            companyImg:''
        }
        this.load_surveyJs = this.load_surveyJs.bind(this);
        
    }
    
    componentDidMount(){  
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $('[data-toggle="push-menu"]').pushMenu('toggle');
        }
        let removeActiveClass = document.querySelector(".activeMenu");
        removeActiveClass.classList.remove("activeMenu");
        let setActiveClass = document.querySelector('.gettestMenu');

        setActiveClass.classList.add('activeMenu');
        sessionStorage.removeItem('screenRecord');sessionStorage.removeItem('videoRecord');
        let data = JSON.stringify({
            "token":sessionStorage.getItem('u_token'),//"1-2-3",
            "licenseKey":this.props.match.params.id
        });
        fetch(apiRoot+'3003/api/get-user-assessment-details', {
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
                this.setState({title:data.data.title});
                this.setState({description:data.data.description});
                if(data.data.companyLogo){
                    this.setState({companyImg:data.data.companyLogo});
                }else{
                    this.setState({companyImg:'../test_dummy.png'});
                }
                
                this.setState({duration:data.data.duration});
                this.setState({avgScore:data.data.avgScore});
                this.setState({noOfQuestions:data.data.noOfQuestions});
                this.setState({licenseKey:data.data.licenseKey});
                this.setState({assessmentStatus:data.data.status});

                sessionStorage.setItem('screenRecord',data.data.screenRecord);
                sessionStorage.setItem('videoRecord',data.data.videoRecord);
                // sessionStorage.setItem('videoRecord',true);
                // sessionStorage.setItem('screenRecord',false);
                // sessionStorage.setItem('videoRecord',false);                
                // this.setState()
                if(data.data.completedAssessments.length!==0){
                    this.setState({
                        header:
                        <tr>
                            <th>StartDate</th>
                            <th>EndDate</th>
                            <th>AvgScore</th>
                            <th>Summary</th>
                            <th>Reports</th>
                        </tr>
                        });
                            // <div className='row table-header'>
                            //     <div className='column col-lg-3 col-xs-3'><b>StartDate</b></div>
                            //     <div className='column col-lg-3 col-xs-3'><b>EndDate</b></div>
                            //     <div className='column col-lg-2 col-xs-2'><b>AvgScore</b></div>
                            //     <div className='column col-lg-2 col-xs-2'><b>Summary</b></div>
                            //     <div className='column download-column col-lg-2 col-xs-2'><b>Reports</b></div>
                            // </div>
                    
                }

                let cAss=data.data.completedAssessments.map((response,index)=>{
                    if(data.data.reportGeneration === true){
                        this.setState({downloadbtn:<a href={apiRoot+"3003/api/download-report/"+response["id"]}>Download</a>})    
                    }else{
                        this.setState({downloadbtn:<a style={{color:'grey'}}>Download</a>})    
                    }
                    if(data.data.displayReportToUser === true){
                        this.setState({viewReport:<Link to={"/summary/"+ response["id"]}>View</Link>})
                    }else{
                        this.setState({viewReport:<a style={{color:'grey'}}>View</a>})
                    }
                    let date = new Date(response['startDate']);
                    let eDate = new Date(data.data.expiryDate);
                    // let exDate =eDate.getDate()+'-' + (eDate.getMonth()+1) + '-'+eDate.getFullYear();
                    let exDate = ('0' + eDate.getDate()).slice(-2) + '-' + ('0' + (eDate.getMonth()+1)).slice(-2) + '-' + eDate.getFullYear();
                    let sDate = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + date.getFullYear();
                    // let sDate=date.getDate()+'-' + (date.getMonth()+1) + '-'+date.getFullYear();
                    return( 
                        <tr key={response['id']}>
                            <td>{sDate}</td>
                            <td>{exDate}</td>
                            <td>{response['avgScore']}</td>
                            <td>{this.state.viewReport}</td>
                            <td>{this.state.downloadbtn}</td>
                        </tr>
                        // <div className='row table-rows' key={response['id']}>
                        //     <div className='column col-lg-3 col-xs-3'>{sDate}</div>
                        //     <div className='column col-lg-3 col-xs-3'>{exDate}</div>
                        //     <div className='column col-lg-2 col-xs-2'>{response['avgScore']}</div>
                        //     <div className='column col-lg-2 col-xs-2'>{this.state.viewReport}</div>
                        //     <div className='column download-column col-lg-2 col-xs-2'>{this.state.downloadbtn}</div>
                        // </div>
                    );
                    
                });
                this.setState({summary:cAss});
                $("#reportTable").DataTable({
                    "bLengthChange": false,
                    "bFilter": false,
                    "bInfo": false,
                    // "scrollY": "200px",
                    "scrollCollapse": true,
                    "ordering": false,
                    language: {
                        oPaginate: {
                            sNext: '<i class="fa fa-forward"></i>',
                            sPrevious: '<i class="fa fa-backward"></i>',
                            sFirst: '<i class="fa fa-step-backward"></i>',
                            sLast: '<i class="fa fa-step-forward"></i>' 
                        }
                        
                     } ,
                });
          
            }else{
                
            }
        }).catch(err=> {
            this.setState({status: err});
        });


       
    }
    load_surveyJs(){
        // alert(this.state.assessmentStatus);
        sessionStorage.setItem('a_title',this.state.title);
        // if(this.state.assessmentStatus === "pending" ){

        // }
        if(this.state.assessmentStatus ==="completed"){
            let data = JSON.stringify({
                "licenseKey":this.state.licenseKey ,
                "token":sessionStorage.getItem('u_token')            
            });
            console.log(data);
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
                    console.log(JSON.stringify(data));
                    sessionStorage.setItem('questionId',data.data.data.id);
                    this.props.history.push('/survey/'+this.state.licenseKey+'/'+data.data.noOfQuestions+'/'+data.data.data.id)
                    // window.location.href='/survey/'+this.state.licenseKey+'/'+data.data.noOfQuestions+'/'+data.data.data.id;
    
                }else if(data.message==="Assessment started, and it's not submitted"){
                    this.props.history.push('/survey/'+this.state.licenseKey+'/'+data.data.noOfQuestions)
                    // window.location.href='/survey/'+this.state.licenseKey+'/'+data.data.noOfQuestions;
                }else{
                     alert(data.message);
                }
            }).catch(err=> {
                alert(err);
            });
        } else{
            this.props.history.push('/survey/'+this.state.licenseKey+'/'+this.state.noOfQuestions)
            // window.location.href='/survey/'+this.state.licenseKey+'/'+this.state.noOfQuestions; 
        }      
    } 
    render() {
        return (
            <div className="content-wrapper"  id="content-wrapper" style={contentDiv}>
            <GetTest/>
                
                <div style={startAssessment}>
                    <div className="row text-center"  id='startdiv'>
                        <div className="col-lg-2">
                            <img id="img" src={this.state.companyImg}></img>
                        </div>
                        <div className="col-lg-10 assessment-header"><span>{this.state.title}</span>
                        <p id='description' className="description">{this.state.description}</p></div>
                    </div>
                    
                    <div className="row text-center">
                        <div className="col-lg-12 col-xs-12 margin-top">
                            <div className="col-lg-3"></div>
                            <div className="col-lg-3 col-xs-6"><font><i className="fa fa-clock-o"></i> {this.state.duration} Minutes</font></div>
                            <div className="col-lg-3 col-xs-6"><font><i className="fa fa-outdent"></i> {this.state.noOfQuestions} Questions</font></div>
                            <div className="col-lg-3"></div>
                        </div>
                    </div> 
                    <div className='text-center'>
                    <div className='col-lg-12 col-xs-12' id="table">
                    <table id="reportTable" className="stripped">
                        <thead>
                            {this.state.header}                               
                            
                        </thead>
                        <tbody>{this.state.summary}</tbody>
                    </table>
                    {/* {this.state.header}
                    {this.state.summary} */}
                    </div>
                    </div>
                    <div className='row text-center'>
                        <button className="start-assessement-btn btn btn-success btn-lg " onClick={this.load_surveyJs} >Start Assessment</button>
                        {/* <ScreenRecording /> */}
                    </div>
                </div> 
 
                 
            </div>
            
        )
    }
}
export default StartAssessment;
