import React, { useState, useEffect } from 'react'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import { connect } from "react-redux"
import { Row, Col } from 'react-bootstrap'
import { updateShop } from '../../redux/actions'
import fetchWithTimeout from '../../fetchWithTimeout'
import Card from "../../components/Card"
import Header from '../../components/Header'
import Button from "../../components/Button"
import './style.css'

const StoreInformationPage = (props) => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [isUpdating, setIsUpdating] = useState(false);
    const [needRegister, setNeedRegister] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [businessHours, setBusinessHours] = useState('');
    const [regularHoliday, setRegularHoliday] = useState('');
    const [warning, setWarning] = useState('');

    useEffect(() => {
        const { shop } = props;

        if (shop == null) {
            setNeedRegister(true);
        } else {
            setName(shop.name);
            setAddress(shop.information.address);
            setPhone(shop.information.phone);
            setBusinessHours(shop.information.business_hours);
            setRegularHoliday(shop.information.regular_holiday);
        }
    }, [props.shop]);

    const onUpdateStore = async () => {
        const updateAPI = (accessToken) => {
            fetchWithTimeout(fetch(process.env.REACT_APP_API_URL + '/shop', {
                method: "PUT", 
                headers: { 
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    shop: {
                        shopname: name,
                        information: {
                            address: address,
                            business_hours: businessHours,
                            phone: phone,
                            regular_holiday: regularHoliday
                        }
                    }
                })
            })).then(res => {
                statusCode = res.status;
                return res.json();
            }).then(body => {
                switch (statusCode) {
                    case 200:
                        props.updateShop(body);
                        if (user.email_verified == true && body.is_set_info == true && body.is_set_system == true) {
                            props.history.push('/waiting');
                        } else {
                            props.history.push('/welcome');
                        }
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
        }

        if (!name) {
            // setWarning('Required.');
            setWarning('必須');
        } else {
            try {
                setIsUpdating(true);

                var statusCode;
                const accessToken = await getAccessTokenSilently();
                if (needRegister) {
                    fetchWithTimeout(fetch(process.env.REACT_APP_API_URL + '/shop', {
                        method: "POST", 
                        headers: { 
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            shop: {
                                email: user.email,
                                shopname: name
                            }
                        })
                    })).then(res => {
                        statusCode = res.status;
                        return res.json();
                    }).then(body => {
                        switch (statusCode) {
                            case 201:
                                updateShop(body);
                                updateAPI(accessToken);
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
                } else {
                    updateAPI(accessToken);
                }

                setIsUpdating(false);
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <>
            <Header />
            <div className="container" style={{paddingTop: 70}}>
                <div className="store-information-page">
                    <div className="tab-wrapper">
                        <div className="tab">{/* Store Information */}店舗情報</div>
                    </div>
                    <Card className="form-store-info">
                        <Row className="form-group">
                            <Col md={3} xl={2}>
                                {/* Store name */}店舗名 ({/* Required */}必須)
                            </Col>
                            <Col md={7} xl={8}>
                                <input className={`form-control ${warning ? 'is-invalid' : ''}`} onChange={e => setName(e.target.value)} value={name} maxLength="50" />
                                {warning && (
                                    <div className="invalid-feedback" style={{display:'block'}}>{warning}</div>
                                )}
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={3} xl={2}>
                                {/* Address */}住所
                            </Col>
                            <Col md={9} xl={10}>
                                <input className="form-control" onChange={e => setAddress(e.target.value)} value={address} maxLength="200" />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={3} xl={2}>
                                {/* Phone number */}電話番号
                            </Col>
                            <Col md={6} xl={4}>
                                <input className="form-control" onChange={e => setPhone(e.target.value)} value={phone} maxLength="11" />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={3} xl={2}>
                                {/* Business hours */}営業時間
                            </Col>
                            <Col md={6} xl={4}>
                                <textarea className="form-control" rows="5" onChange={e => setBusinessHours(e.target.value)} value={businessHours} maxLength="100" />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={3} xl={2}>
                                {/* Regular holiday */}定休日
                            </Col>
                            <Col md={6} xl={4}>
                                <textarea className="form-control" rows="5" onChange={e => setRegularHoliday(e.target.value)} value={regularHoliday} maxLength="100" />
                            </Col>
                        </Row>
                    </Card>
                    <Button className="primary px-5 mt-5" shawdow={false} onClick={onUpdateStore}>
                        {isUpdating ? (
                            <div className="spinner-border" style={{height:20, width:20}}></div> 
                        ) : (
                            // 'Save'
                            '保存'
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return { shop: state };
}

export default withAuthenticationRequired(connect(mapStateToProps, { updateShop })(StoreInformationPage), {
    onRedirecting: () => <div>Loading...</div>,
});
