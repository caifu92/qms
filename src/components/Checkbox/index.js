import React from 'react'
import './style.css'

const Checkbox = (props) => {
    const handleChange = () => {
        if (props.onChange) {
            props.onChange();
        }
    }

    return (
        <label className={`my-checkbox ${props.className}`}>
            {props.children}
            <input type="checkbox" onChange={handleChange} checked={props.checked} />
            <span className="my-checkbox-mark"></span>
        </label>
    )
}

export default Checkbox;
