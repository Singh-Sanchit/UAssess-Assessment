import React, { Component } from 'react';
import ProgressBar from './ProgressBar.js';
import { Col,Row,FormGroup,Form,Input} from 'reactstrap';

class Step3 extends Component{
    render() {
        if (this.props.currentStep !== 3) {
            return null
          } 
        return (
            <Row>
            <ProgressBar activeStep={2} />
                {this.props.previousButton}   
            <Col xs={12} sm={12} md={12} lg={12} xl={12} >
                {/* <h5>Invite For An Assessment</h5><br/> */}
                <p className="text-red">{this.props.status}</p>
                <Col xs={10} sm={10} md={10} lg={10} xl={10} >
                    <Form>
                        <FormGroup>
                            <Col xs={4} sm={4} md={4} lg={4} xl={4} className="text-right">
                                <h4>Add Participants : </h4>
                            </Col> 
                            <Col xs={8} sm={8} md={8} lg={8} xl={8} >  
                                <Input type="textarea" rows='6' name="emailIds" id="emailIds" onChange={this.props.handleChange} value={this.props.emailIds} required placeholder="Enter Name and Email ID's separated by comma (Example : Name email@domain.com,)"/>
                                {/* <span style={{color: "red"}}>{this.state.errors["email"]}</span> */}
                            </Col>     
                                
                        </FormGroup><br/>
                        {/* <FormGroup>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="row-top-padding text-center">
                                <Button color="primary" onClick={this.props.inviteAssessee} type="submit" >Invite</Button>
                            </Col>
                        </FormGroup> */}
                    </Form>
                </Col>
            </Col>
          </Row>
            )
    }
}
export default Step3;