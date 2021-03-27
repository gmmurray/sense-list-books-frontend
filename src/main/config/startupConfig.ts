enum envTypes {
  dev = 'development',
  prod = 'production',
  test = 'test',
}

type auth0Credentials = { domain: string; clientId: string; audience: string };

export const getAuth0Credentials = (): auth0Credentials => {
  const res = {
    domain: process.env.REACT_APP_AUTH0_DOMAIN || '',
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || '',
    audience: process.env.REACT_APP_AUTH0_API_AUDIENCE || '',
  };
  console.log(res);
  switch (process.env.NODE_ENV) {
    case envTypes.dev || envTypes.prod:
      return res;
    default:
      return { domain: 'hi', clientId: '', audience: '' };
  }
};
