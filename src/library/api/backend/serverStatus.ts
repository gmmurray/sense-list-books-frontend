import { ServerStatus } from 'src/library/types/serverStatus';
import { unauthenticatedRequest } from '.';

export const statusRoute = `${process.env.REACT_APP_BACKEND_URL}/server-status`;

export const getServerStatus = async (): Promise<ServerStatus> => {
  return await unauthenticatedRequest({
    method: 'GET',
    url: statusRoute,
  });
};
