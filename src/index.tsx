import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';
import { getAuth0Credentials } from './main/config/startupConfig';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastifyWrapper } from './library/components/layout/ToastifyWrapper';

import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-circular-progressbar/dist/styles.css';

const auth0Credentials = getAuth0Credentials();

ReactDOM.render(
  <Auth0Provider
    domain={auth0Credentials.domain}
    clientId={auth0Credentials.clientId}
    audience={auth0Credentials.audience}
    redirectUri={window.location.origin}
    useRefreshTokens={true}
  >
    <React.StrictMode>
      <BrowserRouter>
        <App />
        <ToastifyWrapper />
      </BrowserRouter>
    </React.StrictMode>
  </Auth0Provider>,
  document.getElementById('root'),
);

reportWebVitals();
