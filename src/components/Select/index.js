import React from 'react'
import './style.css'

const Select = (props) => {
    const handleChange = (e) => {
        if (props.onChange) {
            props.onChange(e.target.value);
        }
    }
    
    return (
        <select className={`my-select form-control ${props.className}`} onChange={handleChange} value={props.value}>
            {props.items.map((item, index) => {
                return (<option value={item.value} key={JSON.stringify(item)}>{item.text}</option>);
            })}
        </select>
    )
}

export default Select;
