import React, { Component } from 'react';
import { Button,Row,Col } from 'reactstrap';
import axios from 'axios';
import {apiRoot} from '../../config.js';
import './Reports.css';

const $ = window.$;


class Reports extends Component{       
    constructor(props){
        super(props);
        
        this.state={
            pdf :'',
            details:<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>,
            status:"",
            fields: {},
            errors: {},completed:0,
            pending:0,
            invited:0,
            noOfAssessee:0,
            arrayOfEmails:[]

        }
        this.usersDetails = this.usersDetails.bind(this);
        this.openModal=this.openModal.bind(this);
        this.contactSubmit = this.contactSubmit.bind(this); 
    }
    handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
       
        //Email
        if(!fields["email"]){
           formIsValid = false;
           errors["email"] = "Cannot be empty";
        }

        if(typeof fields["email"] !== "undefined"){
           let lastAtPos = fields["email"].lastIndexOf('@');
           let lastDotPos = fields["email"].lastIndexOf('.');

           if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
              formIsValid = false;
              errors["email"] = "Email is not valid";
            }
       }  

       this.setState({errors: errors});
       return formIsValid;
   }
    handleChange(field, e){         
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});
    }
    contactSubmit(){
        // e.preventDefault();
        let emailIds=this.state.myArray.toString();
        console.log(this.state.myArray.toString());
        // if(this.handleValidation()){
            axios({
                method:'post',
                data : {token :sessionStorage.getItem('u_token'), licenseKey : this.props.match.params.id ,emailIds:emailIds},
                url:apiRoot+'3000/api/invite-assessee',
                dataType: 'jsonp',
                mode: 'no-cors',
                crossDomain: true,
                responseType: 'json',
                headers: {"Access-Control-Allow-Origin": "*"}
              })
             .then(data =>{
                 console.log(data.data.code);
                if(data.data.code === "0")
                { 
                    let successStatus = <div className="alert alert-success text-center" timeout={1000}>{data.data.message}</div>;
                    this.setState({status:successStatus});
                    setTimeout(e=>{ this.setState({status:''});  }, 3000);
                                        
                }else{
                    let errorStatus = <div className="alert alert-warning text-center" timeout={1000}>{data.data.message}</div>;
                    this.setState({status:errorStatus});
                    setTimeout(e=>{ this.setState({status:''});  }, 3000);
                }            
                    
            });
        // }else{
        // }

    }
    componentDidMount(){
        this.usersDetails();
        $('[data-toggle="tooltip"]').tooltip();
    }
    
    openModal= (e) => {
        e.preventDefault();
        alert(e.target.id);
    }
    usersDetails(){
        axios({
            method:'post',
            data : {token :sessionStorage.getItem('u_token'), licenseKey : this.props.match.params.id },
            url:apiRoot+'3003/api/get-assessment-reports',
            responseType: 'json',
          })
            .then(res => {
                if(res.data.data.participents.length===0){
                    // $('#reportTable').hide();
                    this.setState({emptyReports:<div className="text-center"><h4>Participants are Empty</h4></div>})
                }
                if(res.data.code==="0"){
                    console.log(JSON.stringify(res.data));
                    this.setState({title:res.data.data.title})
                    this.setState({assessmentType:res.data.data.assessmentType})
                    if(res.data.data.daysLeft===0){
                        this.setState({daysLeft:"Expire Today"});
                    }else if(res.data.data.daysLeft<0){
                        this.setState({daysLeft:"Expired"});

                    }else{
                        this.setState({daysLeft:res.data.data.daysLeft + " days left"});
                    }
                    let date = new Date(res.data.data.expiryDate);
                    let exDate = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + date.getFullYear();
                    this.setState({expiryDate:exDate})
                    
                    if(res.data.data.participents.length!==0){
                        var p=0,c=0,i=0;
                        let modal =res.data.data.participents.map((response,index)=>{
                                if(response['videoRecordId']){
                                    this.setState({videoRecord:<iframe width="420" title={response["videoRecordId"]} height="345" src={"https://eu-west-1.ziggeo.io/v/"+response['videoRecordId']}>
                                    </iframe>})
                                }else{
                                    this.setState({videoRecord:<h2>Video Not Found</h2>})
                                }
                                if(response['screenRecordId']){
                                    this.setState({screenRecord:<iframe width="420" title={response["screenRecordId"]} height="345" src={"https://eu-west-1.ziggeo.io/v/"+response['screenRecordId']}>
                                    </iframe>})
                                }else{
                                    this.setState({screenRecord:<h2>Video Not Found</h2>})
                                }
                            
                                return(<div key={index}> <div className="modal fade in" id= {"video-"+index}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                            
                                            <div className="modal-header">
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <i className="fa fa-times-circle"></i>
                                                {/* <span className="text-center" aria-hidden="true">×<br/></span> */}
                                                </button>
                                            </div>
                                            
                                            <div className="modal-body text-center">
                                                {this.state.videoRecord}
                                            </div>
                                            <div className="modal-footer">                                
                                                {/* <Button size="lg" id="okBtn" type="submit" color="success">OK</Button> */}
                                            </div>
                                            <br/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal fade in" id= {"screen-"+index}>
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                        
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-times-circle"></i>
                                            {/* <span className="text-center" aria-hidden="true">×<br/></span> */}
                                            </button>
                                        </div>
                                        
                                        <div className="modal-body text-center">
                                            {this.state.screenRecord}
                                        </div>
                                        <div className="modal-footer">                                
                                            {/* <Button size="lg" id="okBtn" type="submit" color="success">OK</Button> */}
                                        </div>
                                        <br/>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            );
                        });
                        this.setState({modal:modal});
            
                        // let emails = res.data.data.participents.map((response,index)=>{
                        //     return response['email'];
                        // });
                        // this.setState({arrayOfEmails:emails});
                        let arr=[];
                        this.setState({myArray:[]})
                        this.setState({noOfAssessee:res.data.data.participents.length});
                        let details = res.data.data.participents.map((response,index)=>{
                            arr.push(response['email']);
                            this.state.myArray.push(response['email'])
                            if(response["status"]=== "pending"){
                                p++;  
                            }
                            if(response["status"]=== "completed"){
                                c++;  
                            } 
                            if(response["status"]=== "invited"){
                                i++;  
                            }
                            
                            if(response["name"]){
                                this.setState({name:response["name"]})
                            }else{
                                this.setState({name:" - "})
                            }
                            if(response["avgScore"]){
                                this.setState({avgScore:response["avgScore"]})
                            }else{
                                this.setState({avgScore:" - "})
                            }
                            if(response["date"]){
                                let date1 = new Date(response["date"]);
                                let exDate1 = ('0' + date1.getDate()).slice(-2) + '-' + ('0' + (date1.getMonth()+1)).slice(-2) + '-' + date1.getFullYear();
                                this.setState({date:exDate1})
                            }else{
                                this.setState({date:" - "})
                            }
                            if(response["status"] === "completed"){
                                this.setState({pdf:<a href={apiRoot+"3003/api/download-report/"+response["id"]}>Download</a>});  
                            }else{
                                this.setState({pdf:<p style={{ color: 'grey' }}>No Report</p>});
                            }
                            return(<tr key={index+1}><td>{index+1}</td><td>{this.state.name}</td><td>{response["email"]}</td><td>{response["status"]}</td><td>{this.state.avgScore}</td><td>{this.state.pdf}</td><td>{this.state.date}</td>
                                    <td>
                                    <a href="#" data-toggle="modal" data-target={"#video-"+index} id={index} >Vidoe Record</a><br/>
                                    <a href="#" data-toggle="modal" data-target={"#screen-"+index} id={index} >Screen Record</a>
                                        </td>
                                    
                                    </tr>);
                        }); 
                        this.setState({arrayOfEmails:arr});
                        this.setState({pending:p});
                        this.setState({completed:c});
                        this.setState({invited:i});
                        this.setState({details:details});
                        if(this.state.completed!== 0){
                            this.setState({downloadExcel : 
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}> 
                                    <a id="btn-download" href={apiRoot+"3003/api/download-csv-report/"+this.props.match.params.id}><Button color='primary' className="download-btn">Download</Button></a>
                                </Col> 
                            })
                            
                        }else{
                            this.setState({downloadExcel : 
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}> 
                                    <a id="btn-download" href="#"><Button color='primary' disabled="true" className="download-btn">Download</Button></a>
                                </Col> 
                            })
                        }
                        this.setState({downloadBtn:
                            <Col xs={4} sm={4} md={4} lg={4} xl={4} className="reminder-div">     
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <h1 onClick={this.contactSubmit}><i className="fa fa-bell-o reminder-icon" data-toggle="tooltip" data-placement="top" title="Send Reminder"></i></h1>
                                    {/* <Button data-toggle="tooltip" data-placement="top" title="Coming Soon" color='primary' className="pinAssessment-btn ">Pin Assessment</Button> */}
                                </Col>
                                {this.state.downloadExcel}      
                            </Col>
                        })
                        $("#reportTable").DataTable({
                            "bLengthChange": false,
                            "bFilter": false,
                            "bInfo": false,
                            "scrollY": "600px",
                            "scrollCollapse": true,
                            // "scrollX": true
                            // "dom": '<"top"flp<"clear">>rt<"bottom"ifp<"clear">>',
                            language: {
                                oPaginate: {
                                    sNext: '<i class="fa fa-forward"></i>',
                                    sPrevious: '<i class="fa fa-backward"></i>',
                                    sFirst: '<i class="fa fa-step-backward"></i>',
                                    sLast: '<i class="fa fa-step-forward"></i>' 
                                }
                                
                            } ,
                            
                        });
                    }
                }else{
                    // alert(res.data.message);
                }
                    
            }).catch(err=> {
                    console.log(err);
                    this.setState({status: err});
            }); 
    }      
          render() {
            return (
                <div className="content-wrapper">
                    {this.state.nav}                
                    <div className="tableDiv" >
                    {/* <iframe width="420" height="345" src="https://eu-west-1.ziggeo.io/v/r18d186d3f7098c14a361edc59323126">
</iframe> */}
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="padding-bottom">
                                {this.state.status}
                            <Col xs={12} sm={12} md={12} lg={8} xl={8} className="assessment-div">     
                                    <h3>{this.state.title}</h3>
                                    <h4>Assessment Code : {this.props.match.params.id}</h4>
                                    <h4>{this.state.assessmentType}</h4>
                                    <h5>{this.state.expiryDate}<font className="text-red">{this.state.daysLeft}</font></h5>
                                </Col>  
                                {/* <Col xs={6} sm={6} md={6} lg={3} xl={3} className="reminder-div text-center">     
                                    <h1 data-toggle="tooltip" data-placement="top" title="Coming Soon"><i className="fa fa-bell-o reminder-icon"></i></h1>
                                    <p>Send Reminder</p>
                                </Col>  */}
                                {this.state.downloadBtn}  
                            </Col>
                        </Row> 
                        <Row className="padding-3rem">
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="white-bg">
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                            <h3>Total Assessee </h3>
                                            <h3>{this.state.noOfAssessee}</h3>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                            <h3>Completed </h3>
                                            <h3>{this.state.completed}</h3>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                            <h3>Pending </h3>
                                            <h3>{this.state.pending}</h3>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                            <h3>Invited </h3>
                                            <h3>{this.state.invited}</h3>
                                        </Col>
                                    </Col>
                                </Row>
                                <Row>   
                                {this.state.modal}
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="padding-5rem">  
                                                                             
                                        <table className='table-width' id="reportTable">
                                            <thead>
                                            <tr>                                
                                                <th>Sr No.</th>
                                                <th>Name</th>
                                                <th>Email Id</th>
                                                <th>Status</th>
                                                <th>Score</th>
                                                <th>Report</th>
                                                <th>Date</th>
                                                <th>Recordings</th>
                                            </tr>
                                            </thead>
                                            <tbody>{this.state.details}</tbody>
                                        </table>
                                        {this.state.emptyReports} 
                                        
                                    </Col>
                                </Row> 
                            </Col>
                        </Row>
                    </div>
                    
                    {/* <div className="container" style={inviteAssesse}>
                        {this.state.status}
                        <h5>Invite For An Assessment</h5><br/>
                        <Form>
                            <FormGroup>
                            <Input type="textarea" name="nameEmail" id="nameEmail" value={this.state.fields["email"]} onChange={this.handleChange.bind(this, "email")} required placeholder="Enter Name and Email ID's separated by comma (Example : Name email@domain.com,)"/>
                            <span style={{color: "red"}}>{this.state.errors["email"]}</span>
                            <br/>
                            </FormGroup>
                            <Button color="primary" type="submit" onClick={this.contactSubmit.bind(this)}>Invite</Button>
                        </Form>
                    </div> */}
                </div>
            );
          }    
}
export default Reports;
