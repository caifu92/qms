import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Card from '../../components/Card'
import Button from '../../components/Button'
import './style.css'

const RegisterPage = (props) => {
    return (
        <div className="register-page">
            <Card className="form-register">
                <div className="headline">Register</div>
                <div className="description">Input details below.</div>
                <Row className="form-group">
                    <Col md={12}>
                        Email
                    </Col>
                    <Col md={12}>
                        <input type="email" className="form-control" />
                    </Col>
                </Row>
                <Row className="form-group">
                    <Col md={12}>
                        Password
                    </Col>
                    <Col md={12}>
                        <input type="password" className="form-control" />
                    </Col>
                </Row>
                <Row className="form-group">
                    <Col md={12}>
                        Confirm Password
                    </Col>
                    <Col md={12}>
                        <input type="password" className="form-control" />
                    </Col>
                </Row>
                <Button className="primary mt-4 px-5">Register</Button>
            </Card>
        </div>
    );
}

export default RegisterPage;
