import { RouteBreadcrumb, RouteTree } from 'src/library/types/routes';
import Home from 'src/pages/home';
import ServerUnavailable from 'src/pages/home/ServerUnavailable';

const homePrefix = '/home';

const indexBreadcrumbs: RouteBreadcrumb[] = [
  { name: 'Home', root: true, to: homePrefix },
];

const homeRoutes: RouteTree = {
  index: {
    name: 'Home',
    path: homePrefix,
    render: props => <Home {...props} />,
    isPrivate: true,
    exact: true,
    breadcrumbs: indexBreadcrumbs,
  },
  serverUnavailable: {
    name: 'Server Unavailable',
    path: 'server-unavailable',
    render: props => <ServerUnavailable {...props} />,
    isPrivate: false,
    exact: true,
  },
};

export default homeRoutes;
