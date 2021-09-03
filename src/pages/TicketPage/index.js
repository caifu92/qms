import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import { Row, Col } from 'react-bootstrap'
import fetchWithTimeout from '../../fetchWithTimeout'
import Header from '../../components/Header'
import Card from '../../components/Card'
import './style.css'

const TicketPage = (props) => {
    const [shopName, setShopName] = useState('Shop Name');
    const [ticketNo, setTicketNo] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState('00:00-00:00');

    useEffect(() => {
        var statusCode;
        var params = queryString.parse(props.location.search);
        var uuid = params.id;

        fetchWithTimeout(fetch(process.env.REACT_APP_API_URL + `/reservation-status/${uuid}`))
            .then(res => {
                statusCode = res.status;
                return res.json();
            }).then(body => {
                switch (statusCode) {
                    case 200:
                        setShopName(body.name);
                        setTicketNo(body.no);
                        setEstimatedTime(body.estimated_time);
                        break;
                    default:
                        props.history.push({
                            pathname: '/error', 
                            state: { status: statusCode, error: body.errors.body || '内部サーバーエラーが発生しました。' } 
                        });
                        break;
                }
            }).catch(err => {
                props.history.push({
                    pathname: '/error',
                    state: { status: 408, error: '処理のタイムアウトが発生しました。' }
                });
            });
    }, []);

    return (
        <>
            <Header removeMenu={true} />
            <div className="container" style={{paddingTop: 70}}>
                <div className="ticket-page">
                    <div className="page-title">Ticket Information</div>
                    <Card className="page-content">
                        <div className="shop-name">{shopName}</div>
                        <Row>
                            <Col xs={6} style={{textAlign: 'right'}}>
                                Ticket Number :
                            </Col>
                            <Col xs={6} style={{textAlign: 'left'}}>
                                <div className="value">{ticketNo}</div>
                            </Col>
                            <Col xs={6} style={{textAlign: 'right', marginTop: 50}}>
                                Estimated Time :
                            </Col>
                            <Col xs={6} style={{textAlign: 'left', marginTop: 50}}>
                                <div className="value">{estimatedTime}</div>
                            </Col>
                        </Row>
                        <div className="description">The time may vary slightly.</div>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default TicketPage;
