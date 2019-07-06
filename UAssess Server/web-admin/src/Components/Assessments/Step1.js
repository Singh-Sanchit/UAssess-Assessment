import React, { Component } from 'react';
import ProgressBar from './ProgressBar.js';
import { Col,Row,FormGroup,Label,Input} from 'reactstrap';

class Step1 extends Component{
    render() {
        if (this.props.currentStep !== 1) {
            return null
          } 
        return (
            <Row>   
            <ProgressBar activeStep={0} />
            {this.props.previousButton}                     
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="padding--3">
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="white-bg assessment-form">
                    <p className="text-red">{this.props.status}</p>
                    {/* <Form className='assessment-form' > */}
                        <Row  className="row-top-padding">
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="col-no-padding">
                                <FormGroup>
                                    <Label className="assessment-form-label " for="Assessment Name" sm={12}>Name of the Assessment</Label>
                                    <Input 
                                        type="text" 
                                        name="assessmentName" 
                                        id="assessmentName" 
                                        value={this.props.assessmentName}
                                        onChange={this.props.handleChange}
                                        placeholder="Create a name of the Assessment"
                                        required 
                                    />                 
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row  className="row-top-padding">
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="col-no-padding">
                                <FormGroup  >
                                    <Label className="assessment-form-label " for="Objective" sm={12}>Description of the Assessment</Label>
                                    <Input 
                                        type="text" 
                                        name="assessmentObjective" 
                                        id="assessmentObjective" 
                                        value={this.props.assessmentObjective}
                                        onChange={this.props.handleChange}
                                        placeholder="Objective of the the Assessment"
                                        required 
                                    />                 
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row  className="row-top-padding">
                            <Col xs={4} sm={4} md={4} lg={4} xl={4} className="col-no-padding">
                                <FormGroup  >
                                    <Label className="assessment-form-label " for="Questions" sm={12}>Questions</Label>
                                    <Input 
                                        type="number" 
                                        name="noOfQuestions" 
                                        id="noOfQuestions" 
                                        value={this.props.noOfQuestions}
                                        onChange={this.props.handleChange}
                                        min="5" max="100"
                                        required 
                                    />                 
                                </FormGroup>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4} xl={4} className="col-no-padding">
                                <FormGroup  >
                                    {/* <Col xs={10} sm={10} md={10} lg={10} xl={10}> */}
                                        <Label className="assessment-form-label " for="Time" sm={12}>Duration (Minutes)</Label>
                                    {/* </Col> */}
                                    {/* <Col xs={10} sm={10} md={10} lg={10} xl={10}> */}
                                    {/* <Row>
                                        <Col xs={9} sm={9} md={9} lg={9} xl={9}>   */}
                                            <Input 
                                                type="number" 
                                                name="time" 
                                                id="time" 
                                                value={this.props.time}
                                                onChange={this.props.handleChange}
                                                min="0"
                                                // placeholder="Objective of the the Assessment"
                                                required 
                                            /> 
                                        {/* </Col>  
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3} className="text-left"><h5>Minutes</h5></Col>
                                    
                                    </Row> */}
                                    {/* </Col> */}
                                    {/* <Col xs={2} sm={2} md={2} lg={2} xl={2}>Minutes </Col> */}
                                    
                                </FormGroup>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4} xl={4} className="col-no-padding">
                                <FormGroup  >
                                    <Label className="assessment-form-label " for="EndDate" sm={12}>Expiry Date</Label>
                                    <Input 
                                        type="date" 
                                        name="endDate" 
                                        onChange={this.props.handleChange}
                                        value={this.props.endDate}
                                        id="endDate" 
                                        required 
                                    /> 

                                </FormGroup>
                            </Col>
                            {/* <Col xs={3} sm={3} md={3} lg={3} xl={3} className="minutes-div"><FormGroup><span id="minutes">Minutes</span></FormGroup></Col> */}
                        </Row>
                        <Row  className="row-top-padding">
                            {/* <Col xs={3} sm={3} md={3} lg={3} xl={3} className="col-no-padding">
                                <FormGroup  >
                                    <Label className="assessment-form-label " for="StartDate" sm={12}>Start Date</Label>
                                    <Input 
                                        type="date" 
                                        name="startDate" 
                                        id="startDate"
                                        value={this.props.startDate}
                                        onChange={this.props.handleChange} 
                                        required 
                                    />                 
                                </FormGroup>
                            </Col> */}
                            <Col xs={4} sm={4} md={4} lg={4} xl={4} className="col-no-padding">
                                <FormGroup  >
                                    <Label className="assessment-form-label " for="frontCoverImage" sm={12}>Report Front Cover</Label>
                                    {/* <Input 
                                        type="file" 
                                        name="frontCoverImage" 
                                        onChange={this.props.handleChange}
                                        // value={this.props.endDate}
                                        id="frontCoverImage" 
                                        required 595 842
                                    />  */}
                                    {/* <img src={this.props.image} /> */}
                                    
                                    <input ref="file" type="file" name="file" 
                                        className="form-control upload-file" 
                                        id="file"
                                        onChange={this.props.handleChangeImage}
                                        encType="multipart/form-data" 
                                        required/>
                                </FormGroup>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4} xl={4} className="col-no-padding pull-left">
                                <FormGroup>
                                    <img id="uploadedFrontCover" src={this.props.image} />
                                </FormGroup>
                            </Col>
                        </Row>
                            
                    {/* </Form> */}
                </Col>
            </Col>
        </Row>
        )
    }
}
export default Step1;