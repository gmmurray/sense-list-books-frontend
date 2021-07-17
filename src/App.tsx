import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import PrivateRoute from './library/components/auth/PrivateRoute';
import { RouteDeclaration } from './library/types/routes';
import { appRoutes, privateRoutes, publicRoutes } from './main/routes';
import * as serverApi from './library/api/backend/serverStatus';
import { AppContext } from './main/context/appContext';
import FullScreenLoader from './library/components/layout/FullScreenLoader';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  let history = useHistory();
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);
  const [isBackendUnavailable, setIsBackendUnavailable] = useState(false);
  const defaultLocation = isBackendUnavailable
    ? {
        pathname: appRoutes.home.serverUnavailable.path,
        search: '',
        hash: '',
        state: {
          previous: history.location.pathname,
        },
      }
    : undefined;

  useEffect(() => {
    const checkServerStatus = async () => {
      setIsLoadingBackend(true);
      try {
        const serverStatus = await serverApi.getServerStatus();
        if (!serverStatus || !serverStatus.isAlive)
          throw new Error('Server is starting or unavailable');
      } catch (error) {
        setIsBackendUnavailable(true);
      } finally {
        setIsLoadingBackend(false);
      }
    };
    checkServerStatus();
  }, []);

  if (isLoading || isLoadingBackend) {
    return <FullScreenLoader />;
  }
  const contextValue = {
    isLoadingBackend,
    isBackendUnavailable,
    setIsBackendUnavailable,
  };
  return (
    <AppContext.Provider value={contextValue}>
      <Switch location={defaultLocation}>
        {publicRoutes.map(({ path, render, exact }: RouteDeclaration) => (
          <Route key={path} path={path} exact={exact} render={render} />
        ))}
        {privateRoutes.map(({ path, render, exact }: RouteDeclaration) => (
          <PrivateRoute
            key={path}
            isAuthenticated={isAuthenticated}
            path={path}
            exact={exact}
            render={render}
          />
        ))}
        <Route
          render={() => {
            if (isAuthenticated) {
              return <Redirect to={appRoutes.home.index.path} />;
            } else {
              return <Redirect to={appRoutes.auth.login.path} />;
            }
          }}
        />
      </Switch>
    </AppContext.Provider>
  );
}

export default App;
