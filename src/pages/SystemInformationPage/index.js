import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { updateShop } from '../../redux/actions'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import { Row, Col } from 'react-bootstrap'
import fetchWithTimeout from '../../fetchWithTimeout'
import Header from '../../components/Header'
import Card from "../../components/Card"
import Button from "../../components/Button"
import Select from "../../components/Select"
import Checkbox from "../../components/Checkbox"
import './style.css'

var NUMBER_OF_SEVICE = [
    { value: 1, text: 1 },
    { value: 2, text: 2 },
    { value: 3, text: 3 },
    { value: 4, text: 4 },
    { value: 5, text: 5 },
    { value: 6, text: 6 },
    { value: 7, text: 7 },
    { value: 8, text: 8 },
    { value: 9, text: 9 },
    { value: 10, text: 10 },
];

var AVG_SERVICE_TIME = [
    { value: 5, text: 5 },
    { value: 10, text: 10 },
    { value: 20, text: 20 },
    { value: 30, text: 30 },
    { value: 40, text: 40 },
    { value: 50, text: 50 },
    { value: 60, text: 60 },
];

var HOURS = [];
for (let i = 0; i < 24; i ++) 
    HOURS.push({ value: i, text: ("0" + i).slice(-2) });

var MINUTES = [];
for (let i = 0; i < 60; i ++)
    MINUTES.push({ value: i, text: ("0" + i).slice(-2) });

const SystemInformationPage = (props) => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [isUpdating, setIsUpdating] = useState(false);
    const [warning, setWarning] = useState({
        numberOfService: '',
        avgServiceTime: ''
    });
    const [numberOfService, setNumberOfService] = useState(0);
    const [avgServiceTime, setAvgServiceTime] = useState(0);
    const [openingTimeHours, setOpeningTimeHours] = useState(0);
    const [openingTimeMinutes, setOpeningTimeMinutes] = useState(0);
    const [closingTimeHours, setClosingTimeHours] = useState(0);
    const [closingTimeMinutes, setClosingTimeMinutes] = useState(0);
    const [holidayMonday, setHolidayMonday] = useState(false);
    const [holidayTuesday, setHolidayTuesday] = useState(false);
    const [holidayWednesday, setHolidayWednesday] = useState(false);
    const [holidayThursday, setHolidayThursday] = useState(false);
    const [holidayFriday, setHolidayFriday] = useState(false);
    const [holidaySaturday, setHolidaySaturday] = useState(false);
    const [holidaySunday, setHolidaySunday] = useState(false);

    useEffect(() => {
        const { shop } = props;

        if (shop == null) {
            props.history.push('/welcome');
        } else {
            setNumberOfService(shop.system.number_of_supports);
            setAvgServiceTime(shop.system.time_per_person);
            setOpeningTimeHours(shop.system.opening_time_hours);
            setOpeningTimeMinutes(shop.system.opening_time_minutes);
            setClosingTimeHours(shop.system.closing_time_hours);
            setClosingTimeMinutes(shop.system.closing_time_minutes);
            setHolidayMonday(shop.system.holiday_monday);
            setHolidayTuesday(shop.system.holiday_tuesday);
            setHolidayWednesday(shop.system.holiday_wednesday);
            setHolidayThursday(shop.system.holiday_thursday);
            setHolidayFriday(shop.system.holiday_friday);
            setHolidaySaturday(shop.system.holiday_saturday);
            setHolidaySunday(shop.system.holiday_sunday);
        }
    }, [props.shop]);

    const onUpdateSytemInfo = async () => {
        var isError = false;
        var newWarning = { ...warning };

        if (!numberOfService) {
            newWarning.numberOfService = '必須'; // 'Required';
            isError = true;
        } else {
            if (numberOfService < 1 || numberOfService > 5) {
                newWarning.numberOfService = '１～５の整数を入力してください'; // 'Must between 1 and 5';
                isError = true;
            } else {
                newWarning.numberOfService = '';
            }
        }

        if (!avgServiceTime) {
            newWarning.avgServiceTime = '必須'; // 'Required';
            isError = true;
        } else {
            if (avgServiceTime < 1 || avgServiceTime > 60) {
                newWarning.avgServiceTime = '１～６０の整数を入力してください'; // 'Must between 1 and 60';
                isError = true;
            } else {
                newWarning.avgServiceTime = '';
            }
        }

        setWarning(newWarning);
        if (isError) return;

        try {
            setIsUpdating(true);

            var statusCode;
            const accessToken = await getAccessTokenSilently();
            fetchWithTimeout(fetch(process.env.REACT_APP_API_URL + '/shop', {
                method: "PUT", 
                headers: { 
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    shop: {
                        system: {
                            number_of_supperts: parseInt(numberOfService),
                            time_pre_person: parseInt(avgServiceTime),
                            opening_time_hours: parseInt(openingTimeHours),
                            opening_time_minutes: parseInt(openingTimeMinutes),
                            closing_time_hours: parseInt(closingTimeHours),
                            closing_time_minutes: parseInt(closingTimeMinutes),
                            holiday_monday: holidayMonday,
                            holiday_tuesday: holidayTuesday,
                            holiday_wednesday: holidayWednesday,
                            holiday_thursday: holidayThursday,
                            holiday_friday: holidayFriday,
                            holiday_saturday: holidaySaturday,
                            holiday_sunday: holidaySunday
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
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <Header />
            <div className="container" style={{paddingTop: 70}}>
                <div className="system-information-page">
                    <div className="tab-wrapper">
                        <div className="tab">{/* System Information */}システム情報</div>
                    </div>
                    <Card className="form-system-info">
                        <Row className="form-group">
                            <Col md={5} xl={3}>
                                {/* Number of customer service */}同時接客数
                            </Col>
                            <Col md={5} xl={3}>
                                <input type="number" min="1" max="5" className={`form-control ${warning.numberOfService ? 'is-invalid' : ''}`} onChange={(e) => setNumberOfService(e.target.value)} value={numberOfService} />
                                {warning.numberOfService && (
                                    <div className="invalid-feedback" style={{display:'block'}}>{warning.numberOfService}</div>
                                )}
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={5} xl={3}>
                                {/* Average customer service time */}平均対応時間
                            </Col>
                            <Col md={5} xl={3}>
                                <input type="number" min="1" max="60" className={`form-control ${warning.avgServiceTime ? 'is-invalid' : ''}`} onChange={(e) => setAvgServiceTime(e.target.value)} value={avgServiceTime} />
                                {warning.avgServiceTime && (
                                    <div className="invalid-feedback" style={{display:'block'}}>{warning.avgServiceTime}</div>
                                )}
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={5} xl={3}>
                                {/* Reception hours (start-end) */}受付時間（開始-終了）
                            </Col>
                            <Col md={7} xl={4} className="reception-hours">
                                <Select items={HOURS} onChange={setOpeningTimeHours} value={openingTimeHours} />&nbsp;&nbsp;:&nbsp;&nbsp;
                                <Select items={MINUTES} onChange={setOpeningTimeMinutes} value={openingTimeMinutes} />&nbsp;&nbsp;-&nbsp;&nbsp;
                                <Select items={HOURS} onChange={setClosingTimeHours} value={closingTimeHours} />&nbsp;&nbsp;:&nbsp;&nbsp;
                                <Select items={MINUTES} onChange={setClosingTimeMinutes} value={closingTimeMinutes} />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={5} xl={3} className="mb-2">
                                {/* Regular holiday */}定休日
                            </Col>
                            <Col md={7} xl={9}>
                                <Checkbox checked={holidayMonday} onChange={() => setHolidayMonday(!holidayMonday)}>{/* Mo */}月.</Checkbox>
                                <Checkbox className="ml-4" checked={holidayTuesday} onChange={() => setHolidayTuesday(!holidayTuesday)}>{/* Tu */}火.</Checkbox>
                                <Checkbox className="ml-4" checked={holidayWednesday} onChange={() => setHolidayWednesday(!holidayWednesday)}>{/* We */}水.</Checkbox>
                                <Checkbox className="ml-4" checked={holidayThursday} onChange={() => setHolidayThursday(!holidayThursday)}>{/* Th */}木.</Checkbox>
                                <Checkbox className="ml-4" checked={holidayFriday} onChange={() => setHolidayFriday(!holidayFriday)}>{/* Fr */}金.</Checkbox>
                                <Checkbox className="ml-4" checked={holidaySaturday} onChange={() => setHolidaySaturday(!holidaySaturday)}>{/* Sa */}土.</Checkbox>
                                <Checkbox className="ml-4" checked={holidaySunday} onChange={() => setHolidaySunday(!holidaySunday)}>{/* Su */}日.</Checkbox>
                            </Col>
                        </Row>
                    </Card>
                    <Button className="primary px-5 mt-5" shawdow={false} onClick={onUpdateSytemInfo}>
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

const mapStateToProps = state => {
    return { shop: state };
}

export default withAuthenticationRequired(connect(mapStateToProps, { updateShop })(SystemInformationPage), {
    onRedirecting: () => <div>Loading...</div>,
});
