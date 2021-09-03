import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Row, Col, Modal } from 'react-bootstrap'
import fetchWithTimeout from '../../fetchWithTimeout'
import Header from '../../components/Header'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Select from '../../components/Select'
import StatusGroup from '../../components/StatusGroup'
import StatusButton from '../../components/StatusButton'
import './style.css'

const arrMins = [
    { value: 10, text: 10 },
    { value: 20, text: 20 },
    { value: 30, text: 30 },
    { value: 40, text: 40 },
    { value: 50, text: 50 },
    { value: 60, text: 60 },
    { value: 70, text: 70 },
    { value: 80, text: 80 },
    { value: 90, text: 90 },
    { value: 100, text: 100 },
    { value: 110, text: 110 },
    { value: 120, text: 120 },
    { value: 130, text: 130 },
    { value: 140, text: 140 },
];

const WaitingListPage = (props) => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [isLoading, setIsLoading] = useState(false);
    const [numDone, setNumDone] = useState(0);
    const [numWaiting, setNumWaiting] = useState(0);
    const [queue, setQueue] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');

    const [isUpdatingQueue, setIsUpdatingQueue] = useState(false);
    const [selectedQueue, setSelectedQueue] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    const handleModalClose = () => setModalShow(false);
    const handleModalShow = () => setModalShow(true);

    const handleModalSave = async () => {
        setIsUpdatingQueue(true);
        try {
            var statusCode;
            const accessToken = await getAccessTokenSilently();
            fetchWithTimeout(fetch(process.env.REACT_APP_API_URL + `/shops/${props.shop.id}/queue/${selectedQueue.id}`, {
                method: "PUT", 
                headers: { 
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify({
                    queue: {
                        response_time: parseInt(selectedQueue.response_time),
                        status: selectedQueue.status
                    }
                })
            })).then(res => {
                statusCode = res.status;
                return res.json();
            }).then(body => {
                switch (statusCode) {
                    case 200:
                        // const newArr = [...queue];
                        // var newNumDone = 0, newNumWaiting = 0;
                        // for (let i = 0; i < newArr.length; i ++) {
                        //     if (newArr[i].id == selectedQueue.id)
                        //         newArr[i] = { ...body };
                        //     if (newArr[i].status == 'done')
                        //         newNumDone ++;
                        //     if (newArr[i].status == 'waiting')
                        //         newNumWaiting ++;
                        // }
                        // setQueue(newArr);
                        // setNumDone(newNumDone);
                        // setNumWaiting(newNumWaiting);
                        getQueueList();
                        break;
                    default:
                        props.history.push({
                            pathname: '/error', 
                            state: { status: statusCode, error: body.errors.body || '内部サーバーエラーが発生しました。' } 
                        });
                        break;
                }
                setIsUpdatingQueue(false);
                handleModalClose();
            }).catch(err => {
                props.history.push({
                    pathname: '/error',
                    state: { status: 408, error: '処理のタイムアウトが発生しました。' }
                });
            });
        } catch (e) {
            return console.log(e);
        }
    }

    const getQueueList = async () => {
        setIsLoading(true);
        try {
            var statusCode;
            const accessToken = await getAccessTokenSilently();
            fetchWithTimeout(fetch(process.env.REACT_APP_API_URL + '/shop/queue', {
                method: "GET", 
                headers: { 
                    'Authorization': `Bearer ${accessToken}`
                }
            })).then(res => {
                statusCode = res.status;
                return res.json();
            }).then(body => {
                switch (statusCode) {
                    case 200:
                        setNumDone(body.num_done);
                        setNumWaiting(body.num_waiting);
                        setQueue(body.queue);
                        break;
                    default:
                        props.history.push({
                            pathname: '/error', 
                            state: { status: statusCode, error: body.errors.body || '内部サーバーエラーが発生しました。' } 
                        });
                        break;
                }
                setIsLoading(false);
            }).catch(err => {
                props.history.push({
                    pathname: '/error',
                    state: { status: 408, error: '処理のタイムアウトが発生しました。' }
                });
            });
        } catch (e) {
            return console.log(e);
        }
    }

    const getToday = () => {
        var d = new Date();
        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
    }

    const onOpenEditQueueModal = (index) => {
        setSelectedQueue({ ...queue[index] });
        handleModalShow();
    }

    useEffect(() => {
        if (!(user.email_verified == true && props.shop && props.shop.is_set_info == true && props.shop.is_set_system == true)) {
            props.history.push('/welcome');
        } else {
            getQueueList();
            const interval = setInterval(() => {
                if (isUpdatingQueue == false) {
                    getQueueList();
                }
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [props.shop]);

    const onUpdateQueueField = (field, value) => {
        setSelectedQueue({
            ...selectedQueue,
            [field]: value
        });
    }

    const onAddTicket = async () => {
        setIsLoading(true);
        const { shop } = props;
        try {
            var statusCode;
            const accessToken = await getAccessTokenSilently();
            fetchWithTimeout(fetch(process.env.REACT_APP_API_URL + `/shops/${shop.id}/queue`, {
                method: "POST", 
                headers: { 
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })).then(res => {
                statusCode = res.status;
                return res.json();
            }).then(async (body) => {
                switch (statusCode) {
                    case 200:
                        await getQueueList();
                        break;
                    default:
                        props.history.push({
                            pathname: '/error', 
                            state: { status: statusCode, error: '内部サーバーエラーが発生しました。' } 
                        });
                        break;
                }
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }).catch(err => {
                props.history.push({
                    pathname: '/error',
                    state: { status: 408, error: '処理のタイムアウトが発生しました。' }
                });
            });
        } catch (e) {
            return console.log(e);
        }
    }

    return (
        <>
            <Header onAddTicket={onAddTicket} />
            <div className="container" style={{paddingTop: 70}}>
                <div className="waiting-list-page">
                    {isLoading && (
                        <div className="spinner-overlay">
                            <div className="spinner-border"></div>
                        </div>
                    )}
                    <Row className="justify-content-center align-items-center">
                        <Col xs={6} lg={4}>
                            <Card className="waiting-list-card">
                                <span>{/* Waiting */}待機中&nbsp;&nbsp;<b>{numWaiting}</b></span>
                                <span>{/* Done */}対応済&nbsp;&nbsp;<b>{numDone}</b></span>
                            </Card>
                        </Col>
                        <Col xs={6} lg={4}>
                            <Card className="waiting-list-card">
                                <b>{getToday()}</b>
                            </Card>
                        </Col>
                        <Col md={6} lg={4}>
                            <StatusGroup needAll={true} status={filterStatus} onChange={setFilterStatus} />
                        </Col>
                    </Row>
                    <div className="waiting-list mt-5">
                        {queue.map((value, index) => {
                            if (filterStatus == 'all' || filterStatus == value.status) {
                                return (
                                    <div className="waiting-list-item" onClick={() => onOpenEditQueueModal(index)} key={value.id}>
                                        <div className="flex-desktop w-30-desktop">
                                            <div className="ticket-number">{value.no}</div>
                                            <div className="estimate-time">{value.estimated_date}</div>
                                        </div>
                                        <div className="flex-desktop w-50-desktop">
                                            <div className="ticket-time">
                                                <div className="label">{/* Ticketing time */}発券時間</div>
                                                <div className="text">{value.reception_time}</div>
                                            </div>
                                            <div className="service-time">
                                                <div className="label">{/* Service Time */}対応時間</div>
                                                <div className="text">{value.response_time}{/* min */}分</div>
                                            </div>
                                        </div>
                                        <div className="waiting-status w-20-desktop">
                                            <StatusButton status={value.status} />
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>

                    <Modal className="modal-waiting-item" show={modalShow} onHide={handleModalClose}>
                        <Modal.Body>
                            {selectedQueue != null && (
                                <>
                                <div className="ticket-number">{selectedQueue.no}</div>
                                <Row>
                                    <Col xs={6}>{/* Estimated Time */}案内予定時間</Col>
                                    <Col xs={6}>{selectedQueue.estimated_date}</Col>
                                    <Col xs={6}>{/* Ticketing Time */}発券時間</Col>
                                    <Col xs={6}>{selectedQueue.reception_time}</Col>
                                    <Col xs={6}>{/* Start Time */}開始時間</Col>
                                    <Col xs={6}>{selectedQueue.start_time}</Col>
                                    <Col xs={6}>{/* End Time */}終了時間</Col>
                                    <Col xs={6}>{selectedQueue.finished_time}</Col>
                                    <Col xs={6} className="lh-32">{/* Service Time */}対応時間</Col>
                                    <Col xs={6} className="d-flex lh-32">
                                        <Select className="select-minute" items={arrMins} value={selectedQueue.response_time} onChange={(v) => onUpdateQueueField('response_time', v)} />
                                        &nbsp;&nbsp;{/* min */}分
                                    </Col>
                                </Row>
                                <StatusGroup needAll={false} status={selectedQueue.status} onChange={(v) => onUpdateQueueField('status', v)} />
                                <div className="modal-buttons">
                                    <Button type="button" className="secondary" shadow={true} onClick={handleModalClose}>
                                        {/* Close */}閉じる
                                    </Button>
                                    <Button type="button" className="primary ml-4" shadow={true} onClick={handleModalSave}>
                                        {isUpdatingQueue ? (
                                            <div className="spinner-border" style={{height:20, width:20}}></div>
                                        ) : (
                                            // 'Save'
                                            '保存'
                                        )}
                                    </Button>
                                </div>
                                </>
                            )}
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = state => {
    return { shop: state };
}

export default withAuthenticationRequired(connect(mapStateToProps)(WaitingListPage), {
    onRedirecting: () => <div>Loading...</div>,
});
