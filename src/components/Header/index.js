import React, { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { Link, withRouter } from 'react-router-dom'
import { Container, DropdownButton } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from '../Button'
import Logo from '../../assets/images/logo.png'
import MenuIcon from '../../assets/images/menu-icon.png'
import './style.css'

const Header = (props) => {
    const { logout, loginWithRedirect, isAuthenticated } = useAuth0();
    const [isLandingPage, setIsLandingPage] = useState(false);

    useEffect(() => {
        setIsLandingPage(props.location.pathname == "/" ? true : false);
    }, [props.location.pathname == "/"]);

    const onClickTicketing = () => {
        if (props.onAddTicket)
            props.onAddTicket();
    }

    return (
        <div className="header">
            <Container>
                <Link to={props.location.pathname == "/" ? "/" : "/welcome"} className="header-logo float-left d-flex">
                    <img src={Logo} />
                    <p>{/* Qmax Resavation Systems */}Qmax予約システム</p>
                </Link>
                {(!props.hasOwnProperty('removeMenu') || props.removeMenu == false) && (
                    <>
                        <div className="main-menu float-right d-flex">
                            {isLandingPage == false && isAuthenticated == true ? (
                                <>
                                    {props.location.pathname == '/waiting' && (
                                        <Button className="primary" shadow={false} onClick={onClickTicketing}>{/* Ticketing */}受付する</Button>
                                    )}
                                    <DropdownButton className="main-menu-dropdown" title={<img src={MenuIcon} />}>
                                        <Dropdown.Item as="button"><Link to="/waiting">{/* Waiting List */}順番待ちリスト</Link></Dropdown.Item>
                                        <Dropdown.Item as="button"><Link to="/store">{/* Store information */}店舗情報</Link></Dropdown.Item>
                                        <Dropdown.Item as="button"><Link to="/system">{/* System information */}システム情報</Link></Dropdown.Item>
                                        <Dropdown.Divider />
                                        {/* <Dropdown.Item as="button" onClick={() => logout({ returnTo: window.location.origin + '/qms' })}>Logoutログアウト</Dropdown.Item> */}
                                        <Dropdown.Item as="button" onClick={() => logout({ returnTo: window.location.origin })}>{/* Logout */}ログアウト</Dropdown.Item>
                                    </DropdownButton>
                                </>
                            ) : (
                                <>
                                    <button className="auth-button" onClick={() => loginWithRedirect()}>{/* Login */}ログイン</button>
                                    <button className="auth-button ml-3" onClick={() => loginWithRedirect({screen_hint: 'signup'})}>{/* Signup */}サインアップ</button>
                                </>
                            )}
                        </div>
                        <div className="clearfix"></div>
                    </>
                )}
            </Container>
        </div>
    )
}

export default withRouter(Header);
