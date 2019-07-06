import React from "react";
import GetTest from "../Assessments/GetTest";

import Header from "../Header/Header";
import TestSideBar from "../SideBar/TestSideBar";
import AlertBox from "./AlertBox";
import './TestPage.css';
import {ZiggeoRecorder} from 'react-ziggeo';


const $ = window.$;
class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            apiKey: "r10d4578ddb98f554dcb4178f925db81",//"f8e92fb913c0ae8da5a4b097cf833a09",
            playBtn:'',
            recorder: {
                height:200,
                width: 448
            },
            isBlocking:false,
            screenVideo:false,
            screen:false,
            video:false
        }
       
    }

componentDidMount(){
    sessionStorage.removeItem("Screen");
    sessionStorage.removeItem("Video");
    sessionStorage.setItem("videoRecordId"," ");
    sessionStorage.setItem('screenRecordId'," ");
    let removeActiveClass = document.querySelector(".activeMenu");
    removeActiveClass.classList.remove("activeMenu");
    let setActiveClass = document.querySelector('.gettestMenu');
    setActiveClass.classList.add('activeMenu');
    
    if(sessionStorage.getItem('a_title')){
        document.getElementById('assessment1').innerHTML=sessionStorage.getItem('a_title');
        document.getElementById('assessment2').innerHTML=sessionStorage.getItem('a_title');
    }

    document.getElementById('videoRecorder').style.display="none";
    document.getElementById('screenRecorder').style.display="none";

    let token =sessionStorage.getItem('u_token');
    let key = this.props.match.params.key;//sessionStorage.getItem('licenseKey');
    let noOfQuestions =this.props.match.params.noq;// sessionStorage.getItem('a_noOfQuestions');
    let questionId = this.props.match.params.qno;
    
    if(questionId){
        $('#content-wrapper').append('<object id="surveyPage" type="text/html" data="/survey.html?token='+token+'&licenseKey='+key+'&noOfQuestions='+noOfQuestions+'" ></object>');
        // document.getElementById("content-wrapper").append='<object type="text/html" data="/survey.html?token='+token+'&licenseKey='+key+'&noOfQuestions='+noOfQuestions+'" ></object>';   
    }else{
        $('#content-wrapper').append('<object id="surveyPage" type="text/html" data="/survey.html?token='+token+'&licenseKey='+key+'&noOfQuestions='+noOfQuestions+'" ></object>')
        // document.getElementById("content-wrapper").append='<object type="text/html" data="/survey.html?token='+token+'&licenseKey='+key+'&noOfQuestions='+noOfQuestions+'" ></object>';
    } 

    document.getElementById('surveyPage').style.display='none';

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $('[data-toggle="push-menu"]').pushMenu('toggle');
    }
    
    if(sessionStorage.getItem('screenRecord')==="true" && sessionStorage.getItem('videoRecord')==="true"){
        this.setState({screenVideo:true});        
        document.getElementById('screenRecorder').style.display='block';
        document.getElementById('videoRecorder').style.display='block';
    }
    if(sessionStorage.getItem('screenRecord')==="true" && sessionStorage.getItem('videoRecord')==="false"){
        document.getElementById('screenRecorder').style.display='block';  
        sessionStorage.setItem("Video",'1');                      
    }
    if(sessionStorage.getItem('screenRecord')==="false" && sessionStorage.getItem('videoRecord')==="true"){
        document.getElementById('videoRecorder').style.display='block';
        sessionStorage.setItem("Screen",'1');                        
    }
    if(sessionStorage.getItem('screenRecord')==="false" && sessionStorage.getItem('videoRecord')==="false"){
        document.getElementById('surveyPage').style.display='block'; 
        sessionStorage.setItem("Video",'1');
        sessionStorage.setItem("Screen",'1');                       
    }
}
recorderVerified1 = (embedding ) => {
    console.log("verifying");
    let recorderInstance = this.childVideo.recorderInstance();
    let properties = recorderInstance.get();
    sessionStorage.setItem("Video",'1');
    sessionStorage.setItem("videoRecordId",properties['video']);
    sessionStorage.setItem('showPrevious',"2")
    console.log('token1 = ' + properties['video']);
};
recorderVerified= (embedding ) => {
    let recorderInstance = this.childScreen.recorderInstance();
    let properties = recorderInstance.get();
    sessionStorage.setItem("Screen",'1');
    sessionStorage.setItem("screenRecordId",properties['video']);
    sessionStorage.setItem('showPrevious',"2")
    console.log('token1 = ' + properties['video']);
};
errorScreenRecording=(embedding) => {
    // alert("something went wrong");
    this.screenRecorderRecording();
}

videoRecorderRecording = (embedding)=>{
    this.setState({video:true}); 
    if(!(this.state.screenVideo===true && this.state.screen===false)){
        document.getElementById('surveyPage').style.display='block';
    }
    sessionStorage.setItem("Video",'0');    
    $('#videoRecorder.ba-videorecorder-button-primary').hide();
    let noOfQuestions =parseInt(this.props.match.params.noq) + parseInt(1);
    window.setInterval(function(){
        console.log("qNo = "+sessionStorage.getItem("qNo"));
        if(parseInt(sessionStorage.getItem("qNo"))===noOfQuestions){
            $('#videoRecorder.ba-videorecorder-button-primary').show();
            $('#videoRecorder').show();  
        }
        else{
            $('#videoRecorder.ba-videorecorder-button-primary').hide();
            $('#videoRecorder').hide();
        }
    }, 1000);    
}
screenRecorderRecording = (embedding /* only starting from react-ziggeo 3.3.0 */) => {
    this.setState({screen:true}); 
    if(!(this.state.screenVideo===true && this.state.video===false)){
        document.getElementById('surveyPage').style.display='block';
    }
    sessionStorage.setItem("Screen",'1');
    $('#screenRecorder.ba-videorecorder-button-primary').hide();
    let noOfQuestions =parseInt(this.props.match.params.noq) + parseInt(1);
    window.setInterval(function(){
        console.log("qNo = "+sessionStorage.getItem("qNo"));
        if(parseInt(sessionStorage.getItem("qNo"))===noOfQuestions){
            $('#screenRecorder.ba-videorecorder-button-primary').show();
            $('#screenRecorder').show();  
        }
        else{
            $('#screenRecorder.ba-videorecorder-button-primary').hide();
            $('#screenRecorder').hide();
        }
    }, 1000);
    
};
videoRecorderUploadProgress = () => {
    console.log('Recorder onRecorderUploadProgress');
};
recorderUploadProgress = () => {
    console.log('Recorder onRecorderUploadProgress');
};

noCamera=(embedding)=>{
    alert("Camera not found");
}
noMicrophone=(embedding)=>{
    alert("Microphone not found");
}
render() {
    
    return(
        // <Router>
            <div>
                <TestSideBar />
                <Header />
                <AlertBox />                                
                <div className='content-wrapper' id='content-wrapper'>
                    <div className="row" id="ziggeo-recorder">                    
                    <ZiggeoRecorder
                        apiKey={this.state.apiKey}
                        onRef={ref => (this.childScreen = ref)}
                        // timelimit={5}
                        id="screenRecorder"
                        expiration-days ="90"
                        framerate={1}
                        countdown={0}
                        responsive={true}
                        picksnapshots={false}
                        allowscreen={true}
                        allowrecord={false} // Optional you can even set it to true
                        allowupload={false} // Optional you can even set it to true
                        chrome_extension_id="meoefjkcilgjlkibnjjlfdgphacbeglk"
                        chrome_extension_install_link="https://chrome.google.com/webstore/detail/ziggeo-screen-capture/meoefjkcilgjlkibnjjlfdgphacbeglk"
                        opera_extension_id="dnnolmnenehhgplebjhbcmfdbaabkepm"
                        opera_extension_install_link="https://addons.opera.com/en/extensions/details/3d46d4c36fefe97e76622c54b2eb6ea1d5406767"
                        onVerified={this.recorderVerified}
                        onAccessForbidden = {this.errorScreenRecording}
                        onRecording={this.screenRecorderRecording}
                        height={this.state.recorder.height}
                        width={this.state.recorder.width}
                        onUploadProgress={this.recorderUploadProgress}
                        onNoCamera={this.noCamera}
                        onNoMicrophone = {this.noMicrophone}
                    />
                    <ZiggeoRecorder
                        id="videoRecorder"
                        expiration-days ="90"
                        onRef={ref => (this.childVideo = ref)}
                        apiKey={this.state.apiKey} 
                        onUploadProgress={this.videoRecorderUploadProgress} 
                        countdown={0} 
                        autorecord={false} 
                        allowupload={false}
                        picksnapshots={false} 
                        height={this.state.recorder.height} 
                        width={this.state.recorder.width} 
                        onVerified={this.recorderVerified1} 
                        onRecording={this.videoRecorderRecording}
                    />
                    </div>
                    
                    <GetTest/>
            
            
                </div>
                {/* <Footer /> */}
            </div>
        // </Router>
        

    );

    }
}
export default SurveyComponent;
