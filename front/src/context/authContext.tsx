import { ReactNode, useCallback, useMemo, useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext<{
  user: string | undefined;
  getUser: string | undefined;
  updateUser: (user: string) => void;
  contextLogout: () => void;
}>({
  user: undefined,
  getUser: undefined,
  updateUser: () => {},
  contextLogout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<undefined | string>(undefined);

  const updateUser = useCallback(
    (user: string) => {
      setUser(user);
    },
    [setUser]
  );

  const getUser = useMemo<string | undefined>(() => user, [user]);

  const contextLogout = () => {
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, getUser, updateUser, contextLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
