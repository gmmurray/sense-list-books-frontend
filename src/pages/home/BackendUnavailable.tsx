import { FC, useState } from 'react';
import { Redirect } from 'react-router';
import { useInterval } from 'src/library/utilities/useInterval';
import { useAppContext } from 'src/main/context/appContext';
import { appRoutes } from 'src/main/routes';
import * as serverStatusApi from 'src/library/api/backend/serverStatus';
import FullScreenLoader from 'src/library/components/layout/FullScreenLoader';
import FullScreenMessage from 'src/library/components/layout/FullScreenMessage';
import { LocationState } from 'history';
import { RouteComponentProps } from 'react-router-dom';

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_INTERVAL = 5000;

const BackendUnavailable: FC<
  RouteComponentProps<{}, any, LocationState | any>
> = ({ location }) => {
  const { isBackendUnavailable, setIsBackendUnavailable } =
    useAppContext() || {};
  const [retryAttempts, setRetryAttempts] = useState(1);
  const maxAttemptsReached = retryAttempts === MAX_RETRY_ATTEMPTS + 1;

  useInterval(async () => {
    if (!maxAttemptsReached && isBackendUnavailable) {
      try {
        console.log(
          `Retrying server... ${retryAttempts}/${MAX_RETRY_ATTEMPTS}`,
        );
        const res = await serverStatusApi.getServerStatus();
        if (res && res.isAlive) {
          setIsBackendUnavailable!(false);
        }
      } catch (error) {
      } finally {
        setRetryAttempts(retryAttempts + 1);
      }
    }
  }, RETRY_INTERVAL);

  if (!isBackendUnavailable) {
    const {
      index: { path: homePath },
    } = appRoutes.home || {};
    const redirectPath = location?.state?.previous ?? homePath;
    return <Redirect to={redirectPath} />;
  }

  if (maxAttemptsReached) {
    return (
      <FullScreenMessage text="We're experiencing issues reaching our server. Please refresh this page or try again later." />
    );
  } else {
    return (
      <FullScreenLoader
        text="Our server is still starting up. Attempting to connect..."
        indeterminate
      />
    );
  }
};

export default BackendUnavailable;
