import { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RouteDeclaration } from 'src/library/types/routes';
import { appRoutes, publicRoutes } from 'src/main/routes';

type PublicRoutesProps = {};

const PublicRoutes: FC<PublicRoutesProps> = () => {
  return (
    <Switch>
      {publicRoutes.map(({ path, render, exact }: RouteDeclaration) => (
        <Route key={path} path={path} exact={exact} render={render} />
      ))}
      <Route render={() => <Redirect to={appRoutes.auth.login.path} />} />
    </Switch>
  );
};

export default PublicRoutes;
