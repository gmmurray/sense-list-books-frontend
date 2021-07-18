import { createContext, useContext } from 'react';
import { UserProfile } from 'src/library/entities/user/UserProfile';

export type AppContextType =
  | {
      isLoadingBackend: boolean;
      isBackendUnavailable: boolean;
      setIsBackendUnavailable: (value: boolean) => any;
      isUserRegistered: boolean;
      currentProfile: UserProfile | null;
    }
  | undefined;

export const AppContext = createContext<AppContextType>(undefined);
export const useAppContext = () => useContext(AppContext);
