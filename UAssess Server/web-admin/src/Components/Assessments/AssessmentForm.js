import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import { Col,Row,FormGroup,Button} from 'reactstrap';
import { apiRoot } from '../../config.js';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

const $ =window.$;
class AssessmentForm extends Component{
    constructor(props) {
        super(props)
        this.state = {
            currentStep: 1,
            assessmentName: '',
            assessmentObjective:'',
            noOfQuestions:'',
            time:0,
            startDate:'',
            endDate:'',
            status:'',
            noOfAttempts:'',
            assessmentSummary:'',
            emailIds:'',
            licenseKey:'',
            frontCoverImage:'',
            image:'',

            checked1: false,
            checked2: false,
            checked3: false,checked4: false,checked5: false,videoRecord:false,screenRecord:false,
            modal:false
        };
        this.handleSwitchChange1 = this.handleSwitchChange1.bind(this);
        this.handleSwitchChange2 = this.handleSwitchChange2.bind(this);
        this.handleSwitchChange3 = this.handleSwitchChange3.bind(this);
        this.handleSwitchChange4 = this.handleSwitchChange4.bind(this);
        this.handleSwitchChange5 = this.handleSwitchChange5.bind(this);
        this.handleSwitchChangeVideo = this.handleSwitchChangeVideo.bind(this);
        this.handleSwitchChangeScreen = this.handleSwitchChangeScreen.bind(this);
        this.changePage=this.changePage.bind(this);
        this.toggle = this.toggle.bind(this);
        
    }
    componentDidMount(){
        let data = JSON.stringify({
            "token":sessionStorage.getItem('u_token'),//"1-2-3",
            "licenseKey":this.props.match.params.id//"1234"           
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
                    this.setState({assessmentName:data.data[0].title});
                    this.setState({assessmentObjective:data.data[0].description});
                    this.setState({noOfQuestions:data.data[0].noOfQuestions})
                    this.setState({time:data.data[0].duration})
                    // this.setState({startDate:data.data[0].duration})
                    this.setState({endDate:data.data[0].expiryDate})
                    this.setState({noOfAttempts:data.data[0].noOfAttempts})

                    this.setState({checked2:data.data[0].displayReportToCompany})
                    this.setState({checked3:data.data[0].displayReportToUser})
                    this.setState({assessmentSummary:data.data[0].summary})

                    this.setState({videoRecord:data.data[0].videoRecord})
                    this.setState({screenRecord:data.data[0].screenRecord})
                    // this.setState({emailIds:data.data[0].participents})

                    this.setState({skills:data.data[0].skills})
                    this.setState({competencies:data.data[0].competencies})
                    this.setState({subCompetencies:data.data[0].subCompetencies})
                    this.setState({icon:data.data[0].icon});
                    this.setState({attemptsInterval:data.data[0].attemptsInterval})
                    this.setState({image:data.data[0].frontCoverImage});

                    if(this.state.noOfAttempts!==0){
                        this.setState({checked1:true})
                    }
                }

            }else{
                this.setState({status: data.message});
            }
        }).catch(err=> {
            this.setState({status: err});
        }); 
    }
    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
      }
    handleChange = event => {
        const {name, value} = event.target
        this.setState({status:''})
        this.setState({
            [event.target.name]: event.target.type === 'number' ? parseInt(event.target.value) : event.target.value
            // [name]: value
        })    
    }
    handleSwitchChange1(checked1) {
        this.setState({ checked1 });
    }
    handleSwitchChange2(checked2) {
        this.setState({ checked2 });
    }
    handleSwitchChange3(checked3) {
        this.setState({ checked3 });
    }
    handleSwitchChange4(checked4) {
        this.setState({ checked4 });
    }
    handleSwitchChange5(checked5) {
        this.setState({ checked5 });
    }
    handleSwitchChangeVideo(videoRecord) {
        this.setState({ videoRecord });
    }
    handleSwitchChangeScreen(screenRecord) {
        this.setState({ screenRecord });
    }
    
    
    
    handleSubmit = event => {
        event.preventDefault()
        sessionStorage.removeItem('licenseKey');        
                let data = JSON.stringify({
                    "token":sessionStorage.getItem('u_token'),//"1-2-3",
                    "companyId":sessionStorage.getItem('u_companyId'),//"1234"   
                    'title':this.state.assessmentName,
                    'description':this.state.assessmentObjective,
                    'noOfQuestions':this.state.noOfQuestions,
                    'duration':this.state.time,
                    'expiryDate':this.state.endDate,
                    'noOfAttempts':this.state.noOfAttempts,
                    'displayReportToCompany':this.state.checked2,
                    'displayReportToUser':this.state.checked3, 
                    'summary':this.state.assessmentSummary,
                    'videoRecord':this.state.videoRecord,
                    'screenRecord':this.state.screenRecord,
                    'skills':this.state.skills,
                    'competencies' :this.state.competencies,
                    'subCompetencies':this.state.subCompetencies,
                    'icon':this.state.icon  ,
                    'attemptsInterval':this.state.attemptsInterval ,
                    'frontCoverImage':this.state.image.replace(/^data:image\/(png|jpg);base64,/, "")//"http://35.154.172.174/3003/images/front.png"//this.state.frontCoverImage  
                });
                fetch(apiRoot+'3003/api/create-assessment', {
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
                        sessionStorage.setItem('licenseKey',data.data.licenseKey)
                        this.setState({licenseKey:data.data.licenseKey});
                        $('#activateAssessment').modal('show');
                    }else{
                        alert(data.message);
                    }
                });            
                // this._next();

                // $('#activateAssessment').modal('show');        
    }
    inviteAssessee = event => {
        event.preventDefault();
        let data = JSON.stringify({
            "token":sessionStorage.getItem('u_token'),
            "licenseKey" : this.state.licenseKey ,
            "emailIds":this.state.emailIds
        });

        fetch(apiRoot+'3000/api/invite-assessee', {
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
                    // {this._next()};
                    this.setState({emailIds:""});
                    alert(data.message);
                    // let successStatus = <Alert color="success" timeout={1000}>{data.message}</Alert>;
                    // this.setState({status:successStatus}) 
                }else{
                    // let errorStatus = <Alert color="danger" timeout={1000}>{data.message}</Alert>;
                    // this.setState({status: errorStatus});
                    alert(data.message);
                }
        });
    }
    
    _next = () => {
        if(this.state.assessmentName==='' || this.state.endDate==='' || this.state.assessmentObjective==='' || this.noOfQuestions==='' || this.state.time===''){
            this.setState({status:"Please fill all the fields"});
        }else{
            let currentStep = this.state.currentStep
            currentStep = currentStep >= 3? 4: currentStep + 1
            // if(currentStep===3){
            //     if(this.state.noOfAttempts==''){
            //         this.setState({status:"Please fill all the fields"});    
            //     }
            // }else{
            //     this.setState({
            //         currentStep: currentStep
            //     })
            // }
            // alert("currentStep = "+currentStep);
            this.setState({
                currentStep: currentStep
            })
        }
        
    }
    
    _prev = () => {
        let currentStep = this.state.currentStep
        currentStep = currentStep <= 1? 1: currentStep - 1
        this.setState({
            currentStep: currentStep
        })
    }
    handleChangeImage= evt =>{
        var self = this;
        var file = evt.target.files[0];
        if(file.type.indexOf('image') !== -1) {
            var reader = new FileReader();
            
        
            reader.onload = function(upload) {
                var image = new Image();
 
                //Set the Base64 string return from FileReader as source.
                image.src = upload.target.result;
                       
                //Validate the File Height and Width.
                image.onload = function () {
                    var height = this.height;
                    var width = this.width;
                    if (height === 842 && width === 595) {
                        self.setState({
                            image: upload.target.result
                        });
                        self.setState({frontCoverImage:upload.target.result});                        
                    }else{
                        // self.setState({image:''})
                        alert("Height and Width must be 842px and 595px.");
                        return false;
                    }
                    
                    
                };
                
            };
            reader.readAsDataURL(file);    
            
        }else{
            alert("Upload image only");
        }
    }
    changePage= event => {
        event.preventDefault();
        // this.setState({currentStep:3});
        this._next();
        $('#activateAssessment').modal('toggle');
    }
    previousButton() {
        let currentStep = this.state.currentStep;
        if(currentStep !==1){
          return (
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={10} className="text-right margin-bottom-5rem">
                    <button className="rounded-btn-left" onClick={this._prev} ><i className="fa fa-angle-left"></i></button>
                </Col>
             </Row>
            // <button 
            //   className="btn btn-secondary" 
            //   type="button" onClick={this._prev}>
            // Previous
            // </button>
          )
        }
        return null;
      }
      
      nextButton(){
        let currentStep = this.state.currentStep;
        if(currentStep ===1){
          return (
            <Row >
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className='text-right'>
                    <FormGroup  >
                        <Button id="btnNext"  
                            className="assessment-form-button"
                            type="submit"
                            color="primary"
                            onClick={this._next}
                        >Next
                        </Button>
                    </FormGroup>               
                </Col>
            </Row>
                    
          )
        }
        if(currentStep===2){
            return (
            <Row >
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className='text-right'>
                    <FormGroup  >
                        <Button id="btnNext"  
                            className="assessment-form-button"
                             onClick={this.handleSubmit}
                            type="submit"
                            color="primary"
                            // onClick={this._next}
                            // data-toggle="modal" data-target="#activateAssessment"
                            // disabled={!isEnabled}
                        >Create
                        </Button>
                    </FormGroup>               
                </Col>
            </Row>  
            );  
        }
        if(currentStep ===3){
            return (
              <Row >
                  <FormGroup>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="row-top-padding text-center">
                        <Button color="primary" onClick={this.inviteAssessee} type="submit" >Invite</Button>
                    </Col>
                   </FormGroup>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className='text-right'>
                      <FormGroup  >
                          <Button id="btnNext"  
                              className="assessment-form-button"
                              type="submit"
                              color="primary"
                              onClick={this._next}
                          >Done
                          </Button>
                      </FormGroup>               
                  </Col>
              </Row>
                      
            )
        }
        if(currentStep===4){
            return (
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right">
                        <FormGroup  >
                            <Link to={'/reports/'+this.state.licenseKey}><Button color="info">Check Status</Button></Link>
                        </FormGroup>     
                    </Col>
                </Row>
            )
        }
        return null;
      }
      
    render() {
        return (
                <div className="content-wrapper">
                    {/* <ProgressBar activeStep={1} />*/}
                    {/* {this.previousButton()}  */}
                    {/* <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={10} className="text-right margin-bottom-5rem">
                            <button className="rounded-btn-left" ><Link to={'/create'} ><i className="fa fa-angle-left"></i></Link></button>
                        </Col>
                    </Row> */}
                    
                    {/* <form> */}
                        <Step1 
                            currentStep={this.state.currentStep} 
                            handleChange={this.handleChange}
                            assessmentName={this.state.assessmentName}
                            assessmentObjective={this.state.assessmentObjective}
                            noOfQuestions ={this.state.noOfQuestions}
                            time = {this.state.time}
                            // startDate = {this.state.sstartDate}
                            endDate = {this.state.endDate}
                            previousButton = {this.previousButton()}
                            status = {this.state.status}
                            image = {this.state.image}
                            frontCoverImage= {this.state.frontCoverImage}
                            handleChangeImage = {this.handleChangeImage}
                        />
                        <Step2 
                            currentStep={this.state.currentStep} 
                            handleSwitchChange1={this.handleSwitchChange1}
                            checked1 = {this.state.checked1}
                            handleSwitchChange2={this.handleSwitchChange2}
                            checked2 = {this.state.checked2}
                            handleSwitchChange3={this.handleSwitchChange3}
                            checked3 = {this.state.checked3}
                            handleSwitchChange4={this.handleSwitchChange4}
                            checked4 = {this.state.checked4}
                            handleSwitchChange5={this.handleSwitchChange5}
                            checked5 = {this.state.checked5}
                            handleSwitchChangeScreen ={this.handleSwitchChangeScreen}
                            screenRecord={this.state.screenRecord}
                            handleSwitchChangeVideo={this.handleSwitchChangeVideo}
                            videoRecord={this.state.videoRecord}
                            status = {this.state.status}
                            noOfAttempts = {this.state.noOfAttempts}
                            attemptsInterval = {this.state.attemptsInterval}
                            assessmentSummary = {this.state.assessmentSummary}
                            previousButton = {this.previousButton()}
                            handleChange={this.handleChange}
                            
                            // assessmentObjective={this.state.assessmentObjective}
                        />
                        <div className="modal fade in" id="activateAssessment" >
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-body text-center">
                                        {/* <Form>                         */}
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>                            
                                                <h4>Your Assessment was successfully created!</h4>                                  
                                                </Col>
                                            </Row>
                                        {/* </Form>  */}
                                    </div>
                                    <div className="modal-footer">                                
                                        <Button onClick={this.changePage} color="success">Ok</Button> 
                                    </div>
                                <br/>
                                </div>
                            </div>
                        </div>
                        <Step3 
                            currentStep={this.state.currentStep}  
                            previousButton = {this.previousButton()} 
                            status = {this.state.status}   
                            emailIds = {this.state.emailIds}
                            handleChange={this.handleChange}
                            // inviteAssessee = {this.inviteAssessee}                      
                        />
                        <Step4 
                            currentStep={this.state.currentStep}
                            assessmentName={this.state.assessmentName}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            licenceKey={this.state.licenseKey}
                            // previousButton = {this.previousButton()}  
                              
                        />
                        <Row>
                            <Col>
                            {this.nextButton()}
                            </Col>
                        </Row>
                        
                    {/* </form> */}
                    

                    
                </div>
        )
    }
}


export default AssessmentForm;
