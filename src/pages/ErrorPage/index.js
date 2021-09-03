import React from 'react'
import Header from '../../components/Header'
import Button from '../../components/Button'
import './style.css'

const ErrorPage = (props) => {
    return (
        <>
            <Header />
            <div className="container" style={{paddingTop: 70}}>
                <div className="error-page">
                    {props.location.state ? (
                        <div className="error-text">{props.location.state.status ? props.location.state.status : ''} - {props.location.state.error ? props.location.state.error : 'お探しのページが見つかりませんでした。'}</div>
                    ) : (
                        <div className="error-text">{/* Page Not Found */}お探しのページが見つかりませんでした。</div>
                    )}
                    <Button className="primary back-button" onClick={() => props.history.push('/waiting')}>{/* Back to Top */}順番待ちリストへ戻る</Button>
                </div>
            </div>
        </>
    )
}

export default ErrorPage;
