import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext<{
  userId?: string;
  updateUserId: (user: string) => void;
  contextLogout: () => void;
}>({
  userId: undefined,
  updateUserId: () => {},
  contextLogout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userIdState, setUserIdState] = useState<undefined | string>(undefined);

  const updateUserId = useCallback(
    (_userId: string) => {
      setUserIdState(_userId);
    },
    [setUserIdState]
  );

  const userId = useMemo<string | undefined>(() => userIdState, [userIdState]);

  const contextLogout = () => {
    setUserIdState(undefined);
  };

  return (
    <AuthContext.Provider value={{ userId, updateUserId, contextLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
