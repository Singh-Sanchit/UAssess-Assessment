import React, { Component } from 'react';
import { Col,Row} from 'reactstrap';

class Step4 extends Component{
    render() {
        if (this.props.currentStep !== 4) {
            return null
          } 
        return (
            <Row>
            <Col className="padding-5rem-top">
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                <i className="fa fa-check-circle" aria-hidden="true"></i>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                    <h1>Your Assessment <code>"{this.props.assessmentName}"</code> has been successfully started!</h1>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="padding-left-3rem text-center">
                    <h4>Assessment Code : <font className="text-red">{sessionStorage.getItem('licenseKey')} </font></h4> 
                    {/* <br/> */}
                    <h4>Assessment Name : <font className="text-success">{this.props.assessmentName} </font></h4>
                    {/* <br/> */}
                    <h4>Expiry Date : <font className="text-blue">{this.props.endDate}</font></h4>
                    {/* <br/> */}
                </Col>
            </Col>
            

        </Row>
            )
    }
}
export default Step4;