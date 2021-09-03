import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './redux/store'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider
            domain={process.env.REACT_APP_DOMAIN}
            clientId={process.env.REACT_APP_CLIENT_ID}
            redirectUri={window.location.origin + '/welcome'}
            // redirectUri={window.location.origin + '/qms' + '/welcome'}
            cacheLocation="localstorage"
            useRefreshTokens={true}
            audience={process.env.REACT_APP_AUDIENCE}
            >
            <Provider store={store}>
                <App />
            </Provider>
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
