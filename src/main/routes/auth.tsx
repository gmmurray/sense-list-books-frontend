import { RouteComponentProps } from 'react-router-dom';
import { RenderWithLocationType, RouteTree } from 'src/library/types/routes';
import { StaticContext } from 'react-router';
import Login from 'src/pages/auth/Login';
import ViewUserProfile from 'src/pages/auth/profiles/ViewUserProfile';

const routePrefix = '/auth'; //eslint-disable-line

const authRoutes: RouteTree = {
  login: {
    name: 'Auth',
    path: `/login`,
    render: ({
      location,
    }: RouteComponentProps<
      any,
      StaticContext,
      RenderWithLocationType | any
    >) => <Login from={location?.state?.from ?? null} />,
    isPrivate: false,
    exact: true,
    breadcrumbs: [],
  },
  view: {
    name: 'View',
    path: `/profiles/view/:userId`,
    render: props => <ViewUserProfile {...props} />,
    isPrivate: true,
    exact: true,
    breadcrumbs: [],
  },
};

export default authRoutes;
