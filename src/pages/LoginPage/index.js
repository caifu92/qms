import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Card from '../../components/Card'
import Button from '../../components/Button'
import './style.css'

const LoginPage = (props) => {
    return (
        <div className="login-page">
            <Card className="form-login">
                <div className="headline">Login</div>
                <div className="description">Input login details below.</div>
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
                <Button className="primary mt-4 px-5">Login</Button>
            </Card>
        </div>
    );
}

export default LoginPage;
