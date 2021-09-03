import React from 'react'
import Header from '../../components/Header'
import './style.css'

const HomePage = (props) => {
    return (
        <>
            <Header />
            <div className="container" style={{paddingTop: 70}}>
                <div className="landing-page">
                    <div className="head-tag">About Qmax</div>
                    <div className="title">Landing Page</div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
