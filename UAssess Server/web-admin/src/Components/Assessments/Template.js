import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import { Col,Row,FormGroup,Button} from 'reactstrap';
import { apiRoot } from '../../config.js';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

const $ =window.$;
class TemplateForm extends Component{
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
            attemptsInterval:'',
            assessmentSummary:'',
            emailIds:'',
            licenseKey:'',
            image:'',
            checked1: false,
            checked2: false,
            checked3: false,checked4: false,checked5: false,videoRecord:false,screenRecord:false,
            modal:false,
            frontCoverImage:''
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
            "ids":[this.props.match.params.id],
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
            if(data.code === "0")
            {
                if(data.data.length!==0){
                    this.setState({skills:data.data[0].skills})
                    this.setState({competencies:data.data[0].competencies})
                    this.setState({subCompetencies:data.data[0].subCompetencies})
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
        this.setState({status:''})  
        this.setState({
            [event.target.name]: event.target.type === 'number' ? parseInt(event.target.value) : event.target.value
          });
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
                    'noOfQuestions':parseInt(this.state.noOfQuestions),
                    'duration':parseInt(this.state.time),
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
                    'attemptsInterval':this.state.attemptsInterval,
                    'frontCoverImage':this.state.image.split(',')[1]//"http://35.154.172.174/3003/images/front.png"//this.state.frontCoverImage  
                }); //this.state.image// 
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
                    this.setState({emailIds:""});
                    alert(data.message);
                    
                }else{
                    
                    alert(data.message);
                }
        });
    }
    
    _next = () => {
        if(this.state.assessmentName==='' || this.state.endDate==='' || this.state.assessmentObjective==='' || this.noOfQuestions==='' || this.state.image===''){
            this.setState({status:"Please fill all the fields"});
        }else{
            let currentStep = this.state.currentStep
            currentStep = currentStep >= 3? 4: currentStep + 1
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
                        self.setState({image:''})
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
                    
                        <Step1 
                            currentStep={this.state.currentStep} 
                            handleChange={this.handleChange}
                            assessmentName={this.state.assessmentName}
                            assessmentObjective={this.state.assessmentObjective}
                            noOfQuestions ={this.state.noOfQuestions}
                            time = {this.state.time}
                            endDate = {this.state.endDate}
                            previousButton = {this.previousButton()}
                            status = {this.state.status}
                            handleChangeImage = {this.handleChangeImage}
                            image = {this.state.image}
                            frontCoverImage ={this.state.frontCoverImage}
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
                        />
                        <Step4 
                            currentStep={this.state.currentStep}
                            assessmentName={this.state.assessmentName}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            licenceKey={this.state.licenseKey}                              
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


export default TemplateForm;
