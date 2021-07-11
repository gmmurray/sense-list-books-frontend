import { createContext, useContext } from 'react';

export type AppContextType =
  | {
      isLoadingBackend: boolean;
      isBackendUnavailable: boolean;
      setIsBackendUnavailable: (value: boolean) => any;
    }
  | undefined;

export const AppContext = createContext<AppContextType>(undefined);
export const useAppContext = () => useContext(AppContext);
