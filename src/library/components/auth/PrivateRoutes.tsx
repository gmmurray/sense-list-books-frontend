import { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { RouteDeclaration } from 'src/library/types/routes';
import { useAppContext } from 'src/main/context/appContext';
import { appRoutes, privateRoutes } from 'src/main/routes';
import { staticRoutes } from 'src/main/routes/staticRoutes';
import PrivateRoute from './PrivateRoute';

const PrivateRoutes = () => {
  const { isBackendUnavailable, isUserRegistered } = useAppContext() || {};
  let history = useHistory();

  // handle re-routing when the backend is down
  useEffect(() => {
    if (isBackendUnavailable) {
      history.push(staticRoutes.backendUnavailable.path, {
        previous: history.location.pathname,
      });
    }
  }, [history, isBackendUnavailable]);

  // handle re-routing when the user needs to register their profile
  useEffect(() => {
    if (!isUserRegistered && !isBackendUnavailable) {
      history.push(appRoutes.auth.registerUser.path, {
        previous: history.location.pathname,
      });
    }
  }, [history, isBackendUnavailable, isUserRegistered]);

  return (
    <Switch>
      <PrivateRoute
        key={staticRoutes.backendUnavailable.path}
        isAuthenticated={true}
        exact={staticRoutes.backendUnavailable.exact}
        path={staticRoutes.backendUnavailable.path}
        render={staticRoutes.backendUnavailable.render}
      />
      <PrivateRoute
        key={appRoutes.auth.registerUser.path}
        isAuthenticated={true}
        exact={appRoutes.auth.registerUser.exact}
        path={appRoutes.auth.registerUser.path}
        render={appRoutes.auth.registerUser.render}
      />
      {privateRoutes.map(({ path, render, exact }: RouteDeclaration) => (
        <PrivateRoute
          key={path}
          isAuthenticated={true}
          path={path}
          exact={exact}
          render={render}
        />
      ))}
      <Route render={() => <Redirect to={appRoutes.home.index.path} />} />
    </Switch>
  );
};

export default PrivateRoutes;
