import React, { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import history from "./history"
import fetchWithTimeout from './fetchWithTimeout'
import { connect } from 'react-redux'
import { updateShop, resetShop } from './redux/actions'
import logo from './logo.svg';
import './App.css';

import HomePage from './pages/HomePage'
import WaitingListPage from './pages/WaitingListPage'
import StoreInformationPage from './pages/StoreInformationPage'
import SystemInformationPage from './pages/SystemInformationPage'
import ErrorPage from './pages/ErrorPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import WelcomePage from './pages/WelcomePage'
import TicketPage from './pages/TicketPage'
const Loading = () => {
    return (
        <div>Loading...</div>
    )
}

// const ProtectedRoute = ({ component, ...args }) => (
//   <Route
//     component={withAuthenticationRequired(component, {
//       onRedirecting: () => <Loading />,
//     })}
//     {...args}
//   />
// );

const App = (props) => {
    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [isGettingShopInfo, setIsGettingShopInfo] = useState(false);
    
    useEffect(() => {
        const getShopData = async() => {
            try {
                setIsGettingShopInfo(true);

                var statusCode = 200;
                const accessToken = await getAccessTokenSilently();
                fetchWithTimeout(fetch(process.env.REACT_APP_API_URL + '/shop', {
                    method: "GET", 
                    headers: { 'Authorization': `Bearer ${accessToken}` } 
                })).then(res => {
                    statusCode = res.status;
                    return res.json();
                }).then(body => {
                    switch (statusCode) {
                        case 200:
                            props.updateShop(body);
                            break;
                        case 404:
                            props.resetShop(null);
                            break;
                        default:
                            history.push({
                                pathname: '/error', 
                                state: { status: statusCode, error: body.errors.body || 'Internal Server Error' } 
                            });
                            break;
                    }
                    setIsGettingShopInfo(false);
                }).catch(err => {
                    history.push({
                        pathname: '/error',
                        state: { status: 408, error: 'Request Timeout' }
                    });
                });
            } catch (e) {
                console.log(e);
            }
        }

        if (isAuthenticated) {
            getShopData();
        }
    }, [isAuthenticated]);

    return (
        <div className="App">
            {(isLoading || isGettingShopInfo) ? (
                <div className="spinner-overlay">
                    <div className="spinner-border"></div>
                </div>
            ) : (
                // <Router history={history} basename="/qms">
                <Router history={history}>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route exact path="/waiting" component={WaitingListPage} />
                        <Route exact path="/store" component={StoreInformationPage} />
                        <Route exact path="/system" component={SystemInformationPage} />
                        <Route exact path="/welcome" component={WelcomePage} />
                        <Route exact path="/error" component={ErrorPage} />
                        <Route exact path="/shops/:shopId/queue" component={TicketPage} />
                        <Route component={ErrorPage} />
                    </Switch>
                </Router>
            )}
        </div>
    );
}

export default connect(null, { updateShop, resetShop })(App);
