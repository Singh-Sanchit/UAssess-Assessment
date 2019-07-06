import React, { Component } from 'react';
import Stepper from "react-stepper-horizontal";
import { Col,Row} from 'reactstrap';

class ProgressBar extends Component{

    render() {
        return (
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}className="padding-5rem"> 
                    {/* <h1>Create Assessment</h1> */}
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="progress-bar-div">
                    {/* {title: 'Select Levels to the skills'}, */}
                        <Stepper steps={ [{title: 'Select Assessment'}, {title: 'Edit Assessment'}, {title: 'Adjust Customary Settings'}, {title: 'Invite Assessee'}] } activeStep={ this.props.activeStep } />
                    </Col>
                </Col>
            </Row>
        )
    }

}
export default ProgressBar;