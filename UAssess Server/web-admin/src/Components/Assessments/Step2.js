import React, { Component } from 'react';
import ProgressBar from './ProgressBar.js';
import { Col,Row,FormGroup,Form,Label,Input,Button,Alert} from 'reactstrap';
import Switch from "react-switch";

class Step2 extends Component{
    render() {
        if (this.props.currentStep !== 2) {
            return null
          } 
        return (
            <Row>
                <ProgressBar activeStep={1} />
                    {this.props.previousButton}
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="padding-3">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}><h4 className="div-title">Assessment Questions</h4></Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="assessment-questions-div">
                        <p className="text-red">{this.props.status}</p> 
                        <Row  className="row-top-padding">
                            {/* <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <FormGroup>
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Label>Retest Allowed</Label>
                                    </Col>
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Switch onChange={this.props.handleSwitchChange1} checked={this.props.checked1} className="react-switch" 
                                        onColor="#86d3ff"
                                        onHandleColor="#2693e6"
                                        handleDiameter={20}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                        height={15}
                                        width={38}
                                        className="react-switch"
                                        id="material-switch"
                                    ></Switch>
                                    </Col>
                                </FormGroup>
                            </Col> */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <FormGroup>
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Label>Number of Attempts</Label></Col>
                                    <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                    <Input 
                                        type="number" 
                                        name="noOfAttempts" 
                                        id="noOfAttempts" 
                                        min="0"
                                        value={this.props.noOfAttempts}
                                        onChange={this.props.handleChange}
                                        // placeholder="Objective of the the Assessment"
                                        required 
                                    /> 
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <FormGroup>
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Label>Attempts Interval (Days)</Label></Col>
                                    <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                    <Input 
                                        type="number" 
                                        name="attemptsInterval" 
                                        id="attemptsInterval" 
                                        min="0"
                                        value={this.props.attemptsInterval}
                                        onChange={this.props.handleChange}
                                        // placeholder="Objective of the the Assessment"
                                        required 
                                    /> 
                                    </Col>
                                </FormGroup>
                            </Col>
                            
                        </Row>
                        <Row  className="row-top-padding">
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <FormGroup>
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Label>Show Score to Company</Label>
                                    </Col>
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Switch onChange={this.props.handleSwitchChange2} checked={this.props.checked2} className="react-switch" 
                                        onColor="#86d3ff"
                                        onHandleColor="#2693e6"
                                        handleDiameter={20}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                        height={15}
                                        width={38}
                                        className="react-switch"
                                        id="material-switch"
                                    ></Switch>
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <FormGroup>
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Label>Show Score to Assessee</Label></Col>
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <Switch onChange={this.props.handleSwitchChange3} checked={this.props.checked3} className="react-switch" 
                                        onColor="#86d3ff"
                                        onHandleColor="#2693e6"
                                        handleDiameter={20}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                        height={15}
                                        width={38}
                                        className="react-switch"
                                        id="material-switch"
                                    ></Switch>
                                    </Col>
                                </FormGroup>
                            </Col>
                            
                        </Row>
                        <Row  className="row-top-padding">
                                <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                                    <FormGroup>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <Label>Assessment Completion Summary</Label>
                                        </Col>
                                        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                                        <Input type="textarea" className="form-control" onChange={this.props.handleChange} rows='3' name="assessmentSummary" id="assessmentSummary" value={this.props.assessmentSummary} />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>

                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}><h4 className="div-title">Security Questions</h4></Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="security-questions-div">
                        
                            {/* <Row  className="row-top-padding">
                                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <FormGroup>
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                        <Label>Shuffle Questions</Label>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                        <Switch onChange={this.props.handleSwitchChange4} checked={this.props.checked4} className="react-switch" 
                                            onColor="#86d3ff"
                                            onHandleColor="#2693e6"
                                            handleDiameter={20}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                            height={15}
                                            width={38}
                                            className="react-switch"
                                            id="material-switch"
                                        ></Switch>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <FormGroup>
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                        <Label>Shuffle Answers</Label></Col>
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                        <Switch onChange={this.props.handleSwitchChange5} checked={this.props.checked5} className="react-switch" 
                                            onColor="#86d3ff"
                                            onHandleColor="#2693e6"
                                            handleDiameter={20}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                            height={15}
                                            width={38}
                                            className="react-switch"
                                            id="material-switch"
                                        ></Switch>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                
                            </Row> */}

                            <Row  className="row-top-padding">
                                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <FormGroup>
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                        <Label>Video Record</Label>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                        <Switch onChange={this.props.handleSwitchChangeVideo} checked={this.props.videoRecord} className="react-switch" 
                                            onColor="#86d3ff"
                                            onHandleColor="#2693e6"
                                            handleDiameter={20}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                            height={15}
                                            width={38}
                                            className="react-switch"
                                            id="material-switch"
                                        ></Switch>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <FormGroup>
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                        <Label>Screen Record</Label></Col>
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                        <Switch onChange={this.props.handleSwitchChangeScreen} checked={this.props.screenRecord} className="react-switch" 
                                            onColor="#86d3ff"
                                            onHandleColor="#2693e6"
                                            handleDiameter={20}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                            height={15}
                                            width={38}
                                            className="react-switch"
                                            id="material-switch"
                                        ></Switch>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                
                            </Row>
                            
                    
                    </Col>
                </Col>
                
            </Row>
            )
    }
}
export default Step2;