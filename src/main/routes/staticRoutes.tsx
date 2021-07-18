import { RouteTree } from 'src/library/types/routes';
import BackendUnavailable from 'src/pages/home/BackendUnavailable';

export const staticRoutes: RouteTree = {
  backendUnavailable: {
    name: 'Backend Unavailable',
    path: '/backend-unavailable',
    render: props => <BackendUnavailable {...props} />,
    isPrivate: false,
    exact: true,
  },
};
