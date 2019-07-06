import React from "react";
import Link from 'react-router-dom/Link';
import './Profile.css';
import Header from '../Header/Header';
import { Container, Row, Col ,Input} from 'reactstrap';
import { apiRoot } from "../../config";
const $ = window.$;
class Profile extends React.Component {
    constructor(props) {
        super(props);
    
        

        this.state = {
          profileImg:'',
          name:'',
          mobileNo:'',
          emailId:'',
          company:'',
          location:'',
          btn:'Edit',
          updatedImage:'',
          imgBase64:'',
          jobRole:''
        };
        this.getMyProfile = this.getMyProfile.bind(this);
        this.editProfile = this.editProfile.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.updateProfile=this.updateProfile.bind(this);
        this.handleInputChange =this.handleInputChange.bind(this);
    }
    updateProfile(){
        let data = "";
        if(document.getElementById('imageBase64').innerHTML!=='Empty'){
             data = JSON.stringify({
                "token":sessionStorage.getItem('u_token'),
                "phone":this.state.mobileNo,
                "profileImage":document.getElementById('imageBase64').innerHTML,
                "name":this.state.name,
                "jobRole":this.state.jobRole
                
              });
        }else{
            data = JSON.stringify({
                "token":sessionStorage.getItem('u_token'),
                "phone":this.state.mobileNo,
                "name":this.state.name,
                "jobRole":this.state.jobRole
                
              });
        }
        
              fetch(apiRoot+'3000/api/update-my-profile', {
                method: 'POST',
                dataType: 'jsonp',
                headers : {
                  'Content-Type': 'application/json'
              },
              body:data
              }).then((res) => res.json())
                .then(data => {
                    if(data.code === "0")
                    { 
                        document.getElementById('profileErrormessege').innerHTML=" ";
                        document.getElementById("mobileNo").disabled = true;
                        document.getElementById("name").disabled = true;
                        document.getElementById('updateProfile').style.display='none';
                        document.getElementById('editProfile').style.display='block';
                        document.getElementById("jobRole").disabled = true;
                        $('#myInput').attr('disabled','disabled');
                        $("#profileImg").removeClass("editProfileImage");
                        $('#editIcon').hide();
                        sessionStorage.setItem("u_name",this.state.name);
                        sessionStorage.setItem("u_email",this.state.emailId);
                        document.getElementById('profileErrormessege').innerHTML='<div style="color:#155724;background-color:#d4edda;border-color:#c3e6cb;" class="text-center alert alert-success">'+data.message+'</div>';
                        setTimeout(() => {
                           $('.alert-success').hide(); 
                          }, 2000);
                    }else{
                        document.getElementById('profileErrormessege').innerHTML=data.message;
                        
                    }
            }).catch((err)=>console.log(err));
    }
    editProfile(){
        document.getElementById('updateProfile').style.display='block';
        document.getElementById('editProfile').style.display='none';
        
        document.getElementById("mobileNo").disabled = false;
        document.getElementById("name").disabled = false;
        document.getElementById("jobRole").disabled = false;
        $("#profileImg").addClass("editProfileImage");       
        $('#myInput').removeAttr('disabled');
        $('#editIcon').show();        
        document.getElementById('profileErrormessege').innerHTML="";        
    }
    getMyProfile(){
        let data=JSON.stringify({
            "token":sessionStorage.getItem('u_token'),//"1-2-3",
        });
        fetch(apiRoot+'3000/api/get-my-profile', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(data =>{
            if(data.code === "0"){
                if(data.data.profileImage){
                    this.setState({profileImg:data.data.profileImage});
                    sessionStorage.setItem("u_profileImage",data.data.profileImage);
                }else{
                    this.setState({profileImg:'../../userCommon.png'});
                }
                this.setState({name:data.data.name});
                this.setState({mobileNo:data.data.phone});
                this.setState({emailId:data.data.email});
                this.setState({jobRole:data.data.jobRole});

            }else{
                document.getElementById('profileErrormessege').innerHTML=data.message;
                
            }
        }).catch(err=> {
            this.setState({status: err});
        });
    }
    componentDidMount(){
        document.getElementById('assessment1').innerHTML='My Profile';
        //document.getElementById('assessment2').innerHTML='My Profile';
        document.getElementById('updateProfile').style.display='none';
        document.getElementById("mobileNo").disabled = true;
        document.getElementById("name").disabled = true;
        document.getElementById("jobRole").disabled = true;
        $('#myInput').attr('disabled','disabled');
        document.getElementById('sidebarToggle').style.visibility='hidden';
        $('#editIcon').hide();
        this.getMyProfile();
    }
    handleInputChange(event) {
        event.preventDefault();
        document.getElementById('profileErrormessege').innerHTML=" ";
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
    onChangeFile(event) {
        document.getElementById('profileErrormessege').innerHTML=" ";
        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];
        this.setState({profileImg:event.target.files[0].name})
        this.setState({file}); 
       
        let reader = new FileReader();
        reader.onload = function(){
            
            document.getElementById('imageBase64').innerHTML = reader.result.split(',')[1];
            
        }
        if(event.target.files[0]){
            reader.readAsDataURL(event.target.files[0]);
        }   
    }
   
    render() {
            return(
                // <Router>
                    <div>
                        <Header />
                        <div>
                        <Row id="profile-navbar">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <span id='profile-back'>
                                <Link to={`/assessments`}><i className='fa fa-chevron-left'></i></Link>
                                {/* <a href='/assessments'><i className='fa fa-chevron-left'></i></a> */}
                                </span>
                                <span id="editIcon" onClick={()=>{this.upload.click()}} ><i className="fa fa-pencil"></i></span>
                                <img id='profileImg' alt="ProfileImage" className='img-circle' src={this.state.profileImg} />
                                <input id="myInput"
                                    type="file"
                                    ref={(ref) => this.upload = ref}
                                    style={{display: 'none'}}
                                    onChange={this.onChangeFile}
                                    />
                                    
                                <span id="profileEmail">
                                {this.state.emailId}                                
                                </span>
                                <a href="#" onClick={this.editProfile} id="editProfile">Edit</a>
                                <a id='updateProfile' href="#" onClick={this.updateProfile} >Save</a>
                            
                        </Col>    
                        </Row>
                        <Container>
                        
                            <Row id='profileRow'>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <p id='imageBase64' style={{visibility:'hidden'}} >Empty</p>
                                    <p className="login-container__form-status" id="profileErrormessege"></p>
                                    <Row>
                                        <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                                            <b>Name</b>
                                            <Input id='name'
                                                type="text" 
                                                name='name'
                                                value={this.state.name}
                                                
                                                onChange={this.handleInputChange}
                                                />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                                            <br/>
                                            <b>Mobile </b>  
                                            <Input id='mobileNo'
                                                type="text" 
                                                name='mobileNo'
                                                value={this.state.mobileNo}
                                                onChange={this.handleInputChange}
                                                /> 
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={8} lg={6} xl={6}><br/><b> Job Role</b> 
                                            <Input id='jobRole'
                                                type="text" 
                                                name="jobRole"
                                                value={this.state.jobRole}
                                                onChange={this.handleInputChange}
                                                /> 
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                        </div>
                        {/* <Footer /> */}
                    </div>
                // </Router>
            );
    }
}
export default Profile;
