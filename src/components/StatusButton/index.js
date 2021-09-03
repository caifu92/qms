import React, { useState, useEffect } from 'react'
import WorkingIcon from '../../assets/images/status-working.png'
import WaitingIcon from '../../assets/images/status-waiting.png'
import CancelIcon from '../../assets/images/status-cancel.png'
import DoneIcon from '../../assets/images/status-done.png'
import './style.css'

const StatusButton = (props) => {
    const [Icon, setIcon] = useState(null);
    const [Text, setText] = useState('');

    useEffect(() => {
        switch (props.status) {
            case 'working':
                setIcon(WorkingIcon);
                setText('接客中');
                break;
            case 'waiting':
                setIcon(WaitingIcon);
                setText('待機中');
                break;
            case 'cancel':
                setIcon(CancelIcon);
                setText('取消し');
                break;
            case 'done':
                setIcon(DoneIcon);
                setText('対応済');
                break;
        }
    }, [props.status]);

    return (
        <button className={`status-button ${props.status}`}>
            <img src={Icon} />
            <span>{Text}</span>
        </button>
    );
}

export default StatusButton;
