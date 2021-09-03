import React from 'react'
import './style.css'

const Button = (props) => {
    return (
        <button className={`button ${props.className} ${props.shadow ? 'shadow' : ''}`} onClick={props.onClick}>
            {props.children}
        </button>
    )
}

export default Button;
