import { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import * as serverApi from './library/api/backend/serverStatus';
import * as usersApi from './library/api/backend/users';
import { AppContext } from './main/context/appContext';
import FullScreenLoader from './library/components/layout/FullScreenLoader';
import PrivateRoutes from './library/components/auth/PrivateRoutes';
import PublicRoutes from './library/components/auth/PublicRoutes';
import { userIsRegistered } from './library/utilities/auth';
import { UserProfile } from './library/entities/user/UserProfile';

function App() {
  const auth = useAuth0();
  const { isAuthenticated, isLoading, user } = auth;
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);
  const [isBackendUnavailable, setIsBackendUnavailable] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    profile: UserProfile | null;
    loading: boolean;
  }>({ profile: null, loading: false });

  const getUserProfile = useCallback(async () => {
    setUserProfile(state => ({ ...state, loading: true }));
    try {
      const profile = await usersApi.getUserProfile(auth, auth.user.sub);
      setUserProfile(state => ({ ...state, profile }));
    } catch (error) {
      console.log(error);
    } finally {
      setUserProfile(state => ({ ...state, loading: false }));
    }
  }, [auth]);

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

  useEffect(() => {
    if (isAuthenticated && user) {
      const registered = userIsRegistered(user);
      setIsUserRegistered(isAuthenticated && registered);
      if (registered) {
        getUserProfile();
      }
    }
  }, [getUserProfile, isAuthenticated, user]);

  if (isLoading || isLoadingBackend || userProfile.loading) {
    return <FullScreenLoader />;
  }

  const contextValue = {
    isLoadingBackend,
    isBackendUnavailable,
    setIsBackendUnavailable,
    isUserRegistered,
    currentProfile: userProfile.profile,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
    </AppContext.Provider>
  );
}

export default App;
