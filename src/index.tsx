import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert';

import { getAuth0Credentials } from './main/config/startupConfig';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AlertTemplate from './library/components/layout/AlertTemplate';
import alertOptions from './library/constants/alertOptions';

import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
  <Auth0Provider
    domain={getAuth0Credentials().domain}
    clientId={getAuth0Credentials().clientId}
    audience={getAuth0Credentials().audience}
    redirectUri={window.location.origin}
    useRefreshTokens={true}
  >
    <React.StrictMode>
      <BrowserRouter>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <App />
        </AlertProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Auth0Provider>,
  document.getElementById('root'),
);

reportWebVitals();
