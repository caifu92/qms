import React from 'react'
import './style.css'

const StatusGroup = (props) => {
    const width = props.needAll ? 20 : 25;
    const handleChange = (status) => {
        if (props.onChange) {
            props.onChange(status);
        }
    }
    return (
        <div className="status-button-group">
            <button 
                onClick={() => handleChange('cancel')}
                className={`cancel ${props.status == 'cancel' ? 'active' : ''}`} 
                style={{width: `${width}%`}}>{/* Cancel */}取消し</button>
            <button 
                onClick={() => handleChange('waiting')}
                className={`waiting ${props.status == 'waiting' ? 'active' : ''}`} 
                style={{width: `${width}%`}}>{/* Waiting */}待機中</button>
            <button 
                onClick={() => handleChange('working')}
                className={`working ${props.status == 'working' ? 'active' : ''}`} 
                style={{width: `${width}%`}}>{/* Working */}接客中</button>
            <button 
                onClick={() => handleChange('done')}
                className={`done ${props.status == 'done' ? 'active' : ''}`} 
                style={{width: `${width}%`}}>{/* Done */}対応済</button>
            {props.needAll && (
                <button 
                    onClick={() => handleChange('all')}
                    className={`all ${props.status == 'all' ? 'active' : ''}`} 
                    style={{width: `${width}%`}}>{/* All */}全て</button>
            )}
        </div>
    );
}

export default StatusGroup;
