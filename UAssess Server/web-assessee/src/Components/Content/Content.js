import React, {Component} from 'react';
import Header from './../Header/Header.js';
import SideBar from './../SideBar/SideBar.js';
import Footer from './../Footer/Footer.js';

import {
    Col,Row,Button
} from 'reactstrap';
import AsideBar from '../SideBar/SideBarNew.js';

export default class Content extends Component {
    render(){
        return (
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                        <AsideBar />
                    </Col>
                    <Col className="content-wrapper" xs={9} sm={9} md={9} lg={9} xl={9}>
                        <h1>Content</h1>
                    </Col> 
                </Col>  
            </Row>
        )
    }
}